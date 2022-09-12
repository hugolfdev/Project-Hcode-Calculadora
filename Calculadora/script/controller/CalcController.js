class CalcController{

    constructor(){



        this._audio = new Audio('click.mp3'); 
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';

        

       
        this._operation =[];
        this._locale = 'pt-BR'
        this._currentDate;
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl =  document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this.initButtonsEvents();
        this.initKeyBoard();
        this.initialize();
    }

    pastFromClipboard(){

        document.addEventListener('paste', e=>{

           let text =  e.clipboardData.getData('Text');

           this.displayCalc = parseFloat(text);

           console.log(text);

        })

    }

    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);
        input.select();

        document.execCommand("Copy");


        input.remove();


    }

    initialize(){
        this.setdisplayDataTime();
        
        setInterval(() =>{
            this.setdisplayDataTime()
        },1000 );

        this.setlastNumberToDisplay();
        this.pastFromClipboard();


        document.querySelectorAll('.btn-ac').forEach(btn =>{

            btn.addEventListener('dblclick', e=>{

                this.toggleAudio();
                
            });

        });
        
    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;

    }

    playAudio(){

        if(this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();

        }

    }

    initKeyBoard(){

        

        document.addEventListener('keyup', e=>{

            this.playAudio();

            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    
                    break;
                case 'Backspace':
                    this.clearEntry();
                    
                    break;
                case '+':
                case '-':
                case "*":
                case "%":
                case "/":
                    this.addOperation(e.key);
                    break;
                case "Enter":
                case "=":
                    this.calc();
                    break;
                case ".":
                case ",":
                    this.addDot();
                    break;
        
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
                
            }
           

        });


    }

    addEventListenerAll(element, events, fun){
        events.split(' ').forEach(event =>{
            element.addEventListener(event, fun, false);
        })
    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setlastNumberToDisplay();
    }

    clearEntry(){
        this._operation.pop();
        this.setlastNumberToDisplay();
    }


    getLastOperation(){
        return  this._operation[this._operation.length - 1];
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value ;
    }

    isOperator(value){

        return ( ['+','-','*','/','%'].indexOf(value) > - 1 )

    }

    puhsOperation(value){

        this._operation.push(value);
        
        if(this._operation.length > 3 ){

            

            this.calc();

        }

    }


    getresult(){

        try{
            return  eval(this._operation.join(""));
        } catch(e){
            setTimeout(()=>{
                this.setError();
            },1)
            
        }
    }

    calc(){

        let last ='';

        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){
            let firshItem = this._operation[0];

            this._operation = [firshItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3 ){

            let last = this._operation.pop();
            this._lastNumber = this.getresult();

        }else if (this._operation.length == 3){            

            this._lastNumber = this.getLastItem(false);

        }

        
        
        
        let result = this.getresult();


        if(last == '%'){

            result /= 100;

            this._operation = [result]    

        }else{

            

            this._operation =[result];

            if(last) this._operation.push(last);

           
        } 
        
        this.setlastNumberToDisplay();
    }


    getLastItem(isOperator = true){
        let lastItem;

        for(let i = this._operation.length - 1;i >= 0 ;i--){
            
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
        }

        if(!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;

    }

    setlastNumberToDisplay(){

        let lastNumber = this.getLastItem(false) ;

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }


    addOperation(value){

        if(isNaN(this.getLastOperation())){
            
            if(this.isOperator(value)){

                this.setLastOperation(value) ;

            }else{
                this.puhsOperation(value);
                this.setlastNumberToDisplay();
            }


        }else{

            if (this.isOperator(value)){
                this.puhsOperation(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                
                this.setlastNumberToDisplay();

            }


        }

        
    }

    setError(){

        this.displayCalc = "Error";

    }

    addDot(){

        let LastOperation = this.getLastOperation();

        if(typeof LastOperation === 'string' && LastOperation.split('').indexOf('.') > -1) return;



        if(this.isOperator(LastOperation) || !LastOperation){
            this.puhsOperation('0.');
        } else{
            this.setLastOperation(LastOperation.toString() + '.');
        } 

        this.setlastNumberToDisplay();

    }

    execBtn(value){

        this.playAudio();

        switch(value){
            case 'ac':
                this.clearAll();
                
                break;
            case 'ce':
                this.clearEntry();
                
                break;
            case 'soma':
                this.addOperation("+");
                break;
            case 'subtracao':
                this.addOperation("-");
                break;
            case "multiplicacao":
                this.addOperation("*");
                break;
            case "porcento":
                this.addOperation("%");
                break;
            case "divisao":
                this.addOperation("/");
                break;
            case "igual":
                this.calc();
                break;
            case "ponto":
                this.addDot();
                break;
    

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value))
                break;
                        
            
            default:
                this.setError();
                break;
        }

    }

    initButtonsEvents(){
       let buttons = document.querySelectorAll("#buttons > g,#parts > g");

       buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, 'click drag', e=>{

                let textBtn = btn.className.baseVal.replace("btn-","");
                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn,"mouseover mouseup mousedown", e =>{
                btn.style.cursor = "pointer";
            });

       });

    }

    setdisplayDataTime(){
        this.displaydate = this.currentDate.toLocaleDateString(this._locale,{
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        this._timeEl.innerHTML;
    }

    set displayTime(value){
        this._timeEl.innerHTML = value;
    }

    get displaydate(){
        this._dateEl.innerHTML;
    }

    set displaydate(value){
        this._dateEl.innerHTML= value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){

        if(value.toString().length > 10 ){
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        return this._currentDate = value;
    }
}