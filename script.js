class Calculator {
    constructor() {
        this.prevValue = '0';
        this.curValue = '0';
        this.inputPermission = true;
        this.operator = "";
    }

    calculate() {
        return eval(this.prevValue + this.operator + this.curValue).toString();
    }

    redefineConfig(operator = '', inputPermission = false) {
        this.operator = operator;
        this.inputPermission = inputPermission;
    }

    getResult() {
        if (this.operator)
            this.curValue = this.calculate();
        this.redefineConfig();

        return this.curValue;
    }

    execFunction(funcName) {
        let result;

        switch (funcName) {
            case '%':
                result = +this.prevValue * (+this.curValue || +this.prevValue) / 100;
                break;
            case 'ln':
                let value;
                if (+this.curValue)
                    value = +this.curValue;
                else
                    value = +this.prevValue

                if (isNaN(value) || value <= 0){
                    this.redefineConfig();
                    throw new Error("Неверные данные");
                }


                result = Math.log(value);
                break;
        }

        this.setFunctionResult(result);

        return this.curValue;
    }

    setFunctionResult(elem) {
        this.inputPermission = false;
        this.curValue = elem.toString();
    }

    setOperator(operatorName) {
        if (operatorName === 'mod')
            operatorName = '%';

        if (this.operator)
            this.prevValue = this.calculate();
        else
            this.prevValue = this.curValue;

        this.redefineConfig(operatorName);

        return this.curValue;
    }

    setNumber(number) {
        if (isNaN(number))
            throw new Error();
        else if (this.inputPermission && this.curValue !== '0')
            this.curValue += number;
        else {
            this.curValue = number;
            this.inputPermission = true;
        }

        return this.curValue;
    }

    setDecimal() {
        if (!this.inputPermission) {
            this.curValue = '0.';
            this.inputPermission = true;
        } else if (!~this.curValue.indexOf('.'))
            this.curValue += '.';

        return this.curValue;
    }

    makeC() {
        this.prevValue = '0';
        this.curValue = '0';

        return this.curValue;
    }

    makeCE() {
        this.curValue = '0';

        return this.curValue;
    }

    makeBackspace() {
        if (this.inputPermission)
            this.curValue = this.curValue.slice(0, -1) || '0';

        return this.curValue;
    }
}

let calcElem = document.querySelector(".calc");
let displayElem = calcElem.querySelector('#display');

let calculator = new Calculator();

calcElem.addEventListener("click", (event) => {
    let elem;
    if ((elem = event.target.closest('.number')) !== null) {
        displayElem.value = calculator.setNumber(elem.innerHTML);
    } else if ((elem = event.target.closest('.function')) !== null) {
        let message;
        try {
            message = calculator.execFunction(elem.innerHTML.toLowerCase());
        }
        catch (e){
            message = e.message;
        }
        displayElem.value = message;
    } else if ((elem = event.target.closest('.operator')) !== null) {
        displayElem.value = calculator.setOperator(elem.innerHTML);
    } else if ((elem = event.target.closest('#result')) !== null) {
        displayElem.value = calculator.getResult();
    } else if ((elem = event.target.closest('#decimal')) !== null) {
        displayElem.value = calculator.setDecimal();
    } else if ((elem = event.target.closest('#backspace')) !== null) {
        displayElem.value = calculator.makeBackspace();
    } else if ((elem = event.target.closest('#c')) !== null) {
        displayElem.value = calculator.makeC();
    } else if ((elem = event.target.closest('#ce')) !== null) {
        displayElem.value = calculator.makeCE();
    }
});

calcElem.addEventListener("keydown", (event) => {
    if (event.key.match(/[0-9]/))
        displayElem.value = calculator.setNumber(event.key);
    else if(event.key.match(/[/*+-]/))
        displayElem.value = calculator.setOperator(event.key);
    else if (event.key === 'backspace')
        displayElem.value = calculator.makeBackspace();
});