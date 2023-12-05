class RSinstructions{
    constructor(busy,op,vj,vk,qj,qk,A){
        this.busy=busy;
        this.op=op;
        this.vj=vj;
        this.vk=vk;
        this.qj=qj;
        this.qk=qk;
        this.A=A;
        this.Intializeinstruction();

    }

    Intializeinstruction(){
        this.RSinstructions.busy=0;
        this.op=null;
        this.vj=null;
        this.vk=null;
        this.qj=null;
        this.qk=null;
        this.A=null;
    }


// setnotBusy(){
//     this.busy=0;
//     this.op=null;
//     this.vj=null;
//     this.vk=null;
//     this.qj=null;
//     this.qk=null;
//     this.A=null;
// }


}

export default RSinstructions;