// Expression Evaluator
        function isoperand(x){
            var charcode = x.charCodeAt(0)
            if(charcode >= 48 && charcode <=57) return true
            return false
        }

        function isoperator(x){
            if(x == "+" || x == "-" || x == "*" || x == "/") return true
            return false
        }

        function expr2arr(expr){
            var arr = new Array()
            arr.push(expr[0])
            if(isoperand(arr[0]) || arr[0] == "("){
                for(var i=1; i<expr.length; i++){
                    var now = expr[i]
                    if(now != " "){
                        if(isoperator(now)){
                            if(isoperand(arr[arr.length-1]) || arr[arr.length-1] == ")"){
                                arr.push(now)
                            }
                            else{
                                return "E"
                            }
                        }
                        else if(isoperand(now)){
                            if(isoperand(arr[arr.length-1])){
                                arr[arr.length-1] = arr[arr.length-1]*10+parseFloat(now)
                                arr[arr.length-1] += ""
                            }
                            else if(isoperator(arr[arr.length-1]) || arr[arr.length-1] == "^" || arr[arr.length-1] == "("){
                                arr.push(now)
                            }
                            else{
                                return "E"
                            }
                        }
                        else if(now == "(" || now == ")" || now == "^"){
                            arr.push(now)
                        }
                        else{
                            return "E"
                        }
                    }
                }
            }
            else{
                return "E"
            }
            return arr
        }

        function arr2eval(arr){
            function oprlv(optr){
                if(optr == "^") return 3
                else if(optr == "*" || optr == "/") return 2
                else if(optr == "+" || optr == "-") return 1
            }
            function calc(x,o,y){
                if(o == "+") return parseFloat(x) + parseFloat(y)
                else if(o == "-") return parseFloat(x) - parseFloat(y)
                else if(o == "*") return parseFloat(x) * parseFloat(y)
                else if(o == "/") return parseFloat(x) / parseFloat(y)
                else if(o == "^") return Math.pow(x,y)
            }

            if(arr != "E"){
                var optr_stack = new Array()
                var opnd_stack = new Array()
                if(isoperand(arr[0])) opnd_stack.push(arr[0])
                else optr_stack.push(arr[0])
                for(var i=1; i<arr.length; i++){
                    var now = arr[i]
                    if(isoperator(now) || now=="^"){
                        if(optr_stack.length > 0){
                            var last = optr_stack.length - 1
                            if(oprlv(optr_stack[last]) >= oprlv(now)){
                                var num = parseFloat(opnd_stack[opnd_stack.length-1])
                                for(var j=last; j>=0; j--){
                                    if(oprlv(optr_stack[optr_stack.length - 1]) >= oprlv(now)){
                                        num = calc(opnd_stack[opnd_stack.length-2], optr_stack[j], num)
                                        optr_stack.pop()
                                        opnd_stack.pop()
                                    }
                                }
                                opnd_stack[opnd_stack.length-1] = num+""
                                optr_stack.push(now)
                            }
                            else{
                                optr_stack.push(now)
                            }
                        }
                        else{
                            optr_stack.push(now)
                        }
                    }
                    else if(isoperand(now)){
                        opnd_stack.push(now)
                    }
                    else if(now == "("){
                        optr_stack.push(now)
                    }
                    else if(now == ")"){
                        var last = optr_stack.length - 1
                        var num = parseFloat(opnd_stack[opnd_stack.length-1])
                        var foundopen = 0
                        for(var j=last; j>=0; j--){
                            if(optr_stack[j] == "("){
                                optr_stack.pop()
                                foundopen = 1
                                break
                            }
                            else{
                                num = calc(opnd_stack[opnd_stack.length-2], optr_stack[j], num)
                                optr_stack.pop()
                                opnd_stack.pop()
                            }
                        }
                        if(foundopen = 0) return "E"
                        opnd_stack[opnd_stack.length-1] = num+""
                    }
                }
                //Calculate All
                var last = optr_stack.length - 1
                var num = parseFloat(opnd_stack[opnd_stack.length-1])
                for(var j=last; j>=0; j--){
                    num = calc(opnd_stack[opnd_stack.length-2], optr_stack[j], num)
                    optr_stack.pop()
                    opnd_stack.pop()
                }
                opnd_stack[opnd_stack.length-1] = num+""
                return opnd_stack[0]
            }
            return "ERROR"
        }

        function MathExprEval(str){
            return arr2eval(expr2arr(str))
        }
// Expression Evaluator

const tela = document.querySelector('div.calculadora__tela');

function deleteFunction(ac) {
    if (ac) {tela.innerHTML = ''; return};
    tela.innerHTML = tela.innerHTML.substring(0, tela.innerHTML.length-1);
};

function putCharacter(html) {
    if (isoperand(html)) {
        tela.innerHTML = tela.innerHTML + html;
    } else {
        const telaLastChar = tela.innerHTML[tela.innerHTML.length-1];
        if (isoperator(telaLastChar) || telaLastChar == '.') {
            return;
        } else if (isoperand(telaLastChar)) {
            tela.innerHTML = tela.innerHTML + html;
        };
    };
};

function showResult() {
    tela.innerHTML = MathExprEval(tela.innerHTML);
};