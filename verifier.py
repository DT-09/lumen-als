from __future__ import annotations
import ast, json, math, re
from dataclasses import asdict, dataclass, field
from typing import Any
import sympy as sp

@dataclass
class Finding:
    item_id: str
    status: str
    severity: str
    title: str
    explanation: str
    rule: str
    evidence: dict[str, Any] = field(default_factory=dict)
    def to_dict(self): return asdict(self)

class ExpressionError(ValueError): pass

def parse_math(source: Any) -> sp.Expr:
    if isinstance(source,(int,float)):
        if not math.isfinite(float(source)): raise ExpressionError("Number must be finite.")
        return sp.sympify(source)
    text=str(source or "").strip().replace("^","**").replace("π","pi")
    if not text or len(text)>240: raise ExpressionError("Expression is empty or too long (240 characters maximum).")
    if not re.fullmatch(r"[A-Za-z0-9_+*/().,\-\s*]+",text): raise ExpressionError("Unsupported expression characters.")
    try: tree=ast.parse(text,mode="eval")
    except SyntaxError as e: raise ExpressionError("Invalid expression syntax.") from e
    symbols={}
    def visit(n):
        if isinstance(n,ast.Expression): return visit(n.body)
        if isinstance(n,ast.Constant) and isinstance(n.value,(int,float)) and not isinstance(n.value,bool):
            if abs(float(n.value))>1e100: raise ExpressionError("Numeric literal too large.")
            return sp.Integer(n.value) if isinstance(n.value,int) else sp.Float(n.value)
        if isinstance(n,ast.Name):
            if n.id=="pi": return sp.pi
            if n.id=="e": return sp.E
            if not re.fullmatch(r"[A-Za-z][A-Za-z0-9_]{0,20}",n.id): raise ExpressionError("Invalid symbol.")
            symbols.setdefault(n.id,sp.Symbol(n.id)); return symbols[n.id]
        if isinstance(n,ast.BinOp) and isinstance(n.op,(ast.Add,ast.Sub,ast.Mult,ast.Div,ast.Pow)):
            a,b=visit(n.left),visit(n.right)
            if isinstance(n.op,ast.Add): return a+b
            if isinstance(n.op,ast.Sub): return a-b
            if isinstance(n.op,ast.Mult): return a*b
            if isinstance(n.op,ast.Div): return a/b
            if b.is_number and abs(float(b))>12: raise ExpressionError("Exponent magnitude limited to 12.")
            return a**b
        if isinstance(n,ast.UnaryOp) and isinstance(n.op,(ast.UAdd,ast.USub)):
            v=visit(n.operand); return v if isinstance(n.op,ast.UAdd) else -v
        raise ExpressionError("Only numbers, variables, parentheses and +, -, *, /, ** are supported.")
    try:
        result=visit(tree)
        if result.count_ops()>100: raise ExpressionError("Expression is too complex.")
        return result
    except (ZeroDivisionError,OverflowError) as e: raise ExpressionError("Expression cannot be evaluated.") from e

def number(value):
    expr=parse_math(value)
    if expr.free_symbols: raise ExpressionError("A concrete numeric value is required.")
    n=float(sp.N(expr))
    if not math.isfinite(n): raise ExpressionError("Number must be finite.")
    return n

def make(item,status,severity,title,explanation,rule,evidence):
    return Finding(str(item.get("id","UNKNOWN")),status,severity,title,explanation,rule,evidence)

def verify_item(item):
    kind=str(item.get("type","")).lower().strip()
    if not str(item.get("prompt","")).strip() or item.get("expected_answer") is None:
        return make(item,"needs_review","medium","Required fields missing","Prompt and expected_answer are required.","schema.required",{"fields":sorted(item)})
    expected=item["expected_answer"]
    try:
        if kind=="equation":
            eq=str(item.get("expression",""))
            if eq.count("=")!=1: raise ExpressionError("Equation must contain exactly one equals sign.")
            lhs,rhs=map(parse_math,eq.split("=",1))
            name=str(item.get("variable","x"))
            if not re.fullmatch(r"[A-Za-z][A-Za-z0-9_]{0,20}",name): raise ExpressionError("Invalid variable name.")
            x=sp.Symbol(name)
            if (lhs.free_symbols|rhs.free_symbols)-{x}: raise ExpressionError("Only the declared variable may appear.")
            difference=sp.simplify(lhs-rhs)
            solutions=sp.solve(sp.Eq(lhs,rhs),x)
            supplied_values=expected if isinstance(expected,list) else [expected]
            answers=[parse_math(value) for value in supplied_values]
            if any(answer.free_symbols for answer in answers): raise ExpressionError("Expected answers must be concrete values.")
            evidence={"method":"SymPy solve on restricted expression","equation":f"{lhs} = {rhs}","variable":name,"computed_solution_set":[str(v) for v in solutions],"supplied_answers":[str(v) for v in answers]}
            if difference==0: return make(item,"needs_review","medium","Equation is an identity","The equation is true for all values in its domain. This release does not certify the full domain or exclusions automatically.","math.equation.identity_review",evidence)
            if not solutions: return make(item,"defect","high","Equation has no solution","No solution exists for the declared variable.","math.equation.empty_set",evidence)
            if len(solutions)>1 and not isinstance(expected,list):
                return make(item,"needs_review","medium","Multiple solutions require a complete answer set","The equation has multiple solutions. Supply expected_answer as an array containing the complete solution set; a single matching value is not enough to verify completeness.","math.equation.multiple_solution_review",evidence)
            matches=(len(answers)==len(solutions) and all(any(sp.simplify(solution-answer)==0 for answer in answers) for solution in solutions) and all(any(sp.simplify(answer-solution)==0 for solution in solutions) for answer in answers))
            if matches: return make(item,"verified","info","Complete answer set matches","The supplied answer set matches the independently computed solution set.","math.equation.match",evidence)
            return make(item,"defect","high","Answer-key mismatch","The supplied answer set does not match the independently computed solution set.","math.equation.mismatch",evidence)
        if kind=="expression":
            ref,ans=parse_math(item.get("expression","")),parse_math(expected)
            ref_den=sp.denom(sp.together(ref)); ans_den=sp.denom(sp.together(ans))
            if (ref_den.free_symbols or ans_den.free_symbols):
                return make(item,"needs_review","medium","Variable denominator requires domain review","Symbolic cancellation can hide excluded values. This release does not certify equivalence when either expression has a variable denominator.","math.expression.domain_review",{"reference":str(ref),"supplied_answer":str(ans),"reference_denominator":str(ref_den),"answer_denominator":str(ans_den)})
            diff=sp.simplify(ref-ans); evidence={"method":"symbolic simplification of reference minus answer","reference":str(ref),"supplied_answer":str(ans),"simplified_difference":str(diff)}
            if diff==0: return make(item,"verified","info","Expressions are equivalent","The expressions simplify to the same symbolic result within the supported domain.","math.expression.equivalent",evidence)
            return make(item,"defect","high","Expression mismatch","The supplied answer is not symbolically equivalent to the reference expression.","math.expression.mismatch",evidence)
        if kind=="newton2":
            v=item.get("values") or {}; force,mass=number(v["force"]),number(v["mass"])
            if mass<=0: raise ExpressionError("Mass must be greater than zero.")
            computed,answer=force/mass,number(expected); evidence={"method":"a = F / m","net_force_N":force,"mass_kg":mass,"computed_acceleration_m_s2":computed,"supplied_answer":answer,"absolute_difference":abs(computed-answer)}
            if math.isclose(computed,answer,rel_tol=1e-8,abs_tol=1e-9): return make(item,"verified","info","Acceleration matches","Supplied answer matches net force divided by mass.","physics.newton2.match",evidence)
            return make(item,"defect","high","Acceleration mismatch","Supplied answer does not match F/m.","physics.newton2.mismatch",evidence)
        if kind=="kinematics":
            v=item.get("values") or {}; u,a,t=(number(v[k]) for k in ("u","a","t"))
            if t<0: raise ExpressionError("Time cannot be negative.")
            target=str(v.get("target","v")).lower()
            if target=="v": computed,formula,unit=u+a*t,"v = u + at","m/s"
            elif target=="s": computed,formula,unit=u*t+0.5*a*t*t,"s = ut + 1/2 at^2","m"
            else: raise ExpressionError("target must be v or s.")
            answer=number(expected); evidence={"method":formula,"initial_velocity_m_s":u,"acceleration_m_s2":a,"time_s":t,"computed_value":computed,"unit":unit,"supplied_answer":answer}
            if math.isclose(computed,answer,rel_tol=1e-8,abs_tol=1e-9): return make(item,"verified","info","Kinematics answer matches",f"Supplied answer matches {formula}.","physics.kinematics.match",evidence)
            return make(item,"defect","high","Kinematics answer mismatch",f"Supplied answer does not match {formula}.","physics.kinematics.mismatch",evidence)
        if kind=="mcq":
            opts=item.get("options",[])
            if isinstance(opts,str):
                try: opts=json.loads(opts)
                except json.JSONDecodeError: opts=[x.strip() for x in opts.split(";") if x.strip()]
            labels=[chr(65+i) for i in range(len(opts))] if isinstance(opts,list) else []
            key=str(item.get("correct_option","")).upper().strip(); ans=str(expected).upper().strip()
            ev={"options":opts,"valid_labels":labels,"correct_option":key,"expected_answer":ans}
            if not labels or key not in labels: return make(item,"needs_review","medium","MCQ structure needs review","Option list or correct option label is invalid.","assessment.mcq.invalid",ev)
            if key==ans: return make(item,"needs_review","low","MCQ key fields agree","This checks field consistency only; it does not independently solve the question.","assessment.mcq.consistency_only",ev)
            return make(item,"defect","high","Conflicting answer-key fields","correct_option and expected_answer disagree.","assessment.mcq.conflict",ev)
        return make(item,"needs_review","medium","Unsupported item type",f"{kind or 'Unspecified'} is not independently checked in this release.","system.unsupported_type",{"supported":["equation","expression","newton2","kinematics","mcq"]})
    except (KeyError,TypeError,ValueError,SyntaxError,ZeroDivisionError,OverflowError) as e:
        return make(item,"needs_review","medium","Automatic verification incomplete",str(e),"system.incomplete",{"type":kind,"supplied_answer":str(expected)})

def audit_items(items):
    ids=[str(item.get("id","UNKNOWN")) for item in items]
    duplicate_ids={value for value in ids if ids.count(value)>1}
    findings=[]
    for item in items:
        if str(item.get("id","UNKNOWN")) in duplicate_ids:
            f=make(item,"needs_review","medium","Duplicate item identifier","This identifier appears more than once in the uploaded bank. Assign unique stable IDs before review decisions are recorded.","schema.duplicate_id",{"item_id":str(item.get("id","UNKNOWN"))})
        else:
            f=verify_item(item)
        findings.append(f.to_dict())
    summary={s:sum(f["status"]==s for f in findings) for s in ("verified","defect","needs_review")}
    return {"product":"STEMPROOF","schema_version":"1.0","item_count":len(items),"summary":summary,"findings":findings}
