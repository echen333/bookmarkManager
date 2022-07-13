
function Alert({msg, setAlertMsg}){
    console.log("MSG", msg);
    return (
        <div>
            {msg.length>0 && 
                <div className="absolute left-5 bottom-5 bg-red-300 h-8 px-4 rounded-md text-white">
                    {msg}
                </div>
            }
        </div>

    )
}

export default Alert;