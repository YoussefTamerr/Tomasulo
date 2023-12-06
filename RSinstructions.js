class RSinstructions{
    constructor(tag,busy,op,vj,vk,qj,qk,A){
        this.tag=tag;
        this.busy=busy;
        this.op=op;
        this.vj=vj;
        this.vk=vk;
        this.qj=qj;
        this.qk=qk;
        this.A=A;

    }

    Intializeinstruction(){
        this.tag=null;
        this.busy=0;
        this.op=null;
        this.vj=null;
        this.vk=null;
        this.qj=null;
        this.qk=null;
        this.A=null;
    }

    displayInstruction(){
        console.log("tag: "+this.tag+"| Busy: "+this.busy+"| Op: "+this.op+"| Vj: "+this.vj+"| Vk: "+this.vk+"| Qj: "+this.qj+"| Qk: "+this.qk+"| A:"+this.A)
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


} export default RSinstructions;

// const inst=new RSinstructions(1,4,5,null,null,null,null);
// inst.displayInstruction();
// inst.Intializeinstruction();
// inst.displayInstruction();
