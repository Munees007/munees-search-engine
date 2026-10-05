const buttonsRef = document.getElementById("buttons") as HTMLDivElement
const expRef = document.getElementById("exp") as HTMLInputElement
document.addEventListener('DOMContentLoaded',()=>{
    const btns:string[] = ['AC','C','(',')','7','8','9','+','4','5','6','-','1','2','3','/','0','=','*','%']
    const isOperator = (key:string) =>{
        const operators:string[] = ['-','+','*','%','/']
        if(operators.includes(key))
        {
            return true
        }
        return false
    }
    btns.forEach((value:string,index:number)=>{
        const p = document.createElement("p") as HTMLParagraphElement

        p.innerText = value;
        p.id = `key${index}`
        p.className = "text-center fw-bold btn-sm fs-5 mb-0 btn"
        const rand = Math.floor(Math.random() * 4)
        const colors:string[] = ["btn-dark","btn-danger","btn-info","btn-warning"]
        p.classList.add(colors[rand])
        p.addEventListener('click',(e)=>{
            try{
                if(expRef.classList.contains("text-danger"))
                {
                    expRef.value = ""
                    expRef.classList.remove("text-danger")
                }
                if(value == "AC")
                {
                    expRef.value = ""
                }
                else if(value == "C")
                {
                    expRef.value = expRef.value.substring(0,expRef.value.length-1)
                }
                else if(value == "=")
                {
                    expRef.value = eval(expRef.value)
                }
                else if(isOperator(expRef.value.charAt(expRef.value.length-1)))
                {
                    if(!isOperator(value))
                    {
                        expRef.value += value;
                    }
                }
                else
                {   
                    expRef.value += value;
                }
            }
            catch(error:any)
            {
                expRef.classList.add("text-danger")
                expRef.value = "Error..."
                console.error(error)
            }
        })        
        buttonsRef.appendChild(p)
    })
    window.addEventListener('keydown',(e)=>{
        try{
            if(expRef.classList.contains("text-danger"))
            {
                expRef.value = ""
                expRef.classList.remove("text-danger")
            }
            if(e.key == "Delete")
            {
                expRef.value = ""
            }
            if(e.key == "Backspace")
            {
                expRef.value = expRef.value.substring(0,expRef.value.length-1)
            }
            if(isOperator(expRef.value.charAt(expRef.value.length-1)))
            {
                if(!isOperator(e.key))
                {
                    expRef.value += e.key;
                }
            }
            else if(['.','7','8','9','4','5','6','1','2','3','0','+','-','/','*','%','(',')'].includes(e.key))
            {
                expRef.value += e.key;
            }
            if(e.key == 'Enter')
            {
                expRef.value = eval(expRef.value)
            }
        }
        catch(error:any)
        {
            expRef.classList.add("text-danger")
            expRef.value = "Error..."
            console.log(error)
        }
    })
})