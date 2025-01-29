const otpVerification = async(otpTime) =>{
    try {
        console.log('Milliseconds is : ' +otpTime);
        const cDateTime = new Date();
        const diff = (otpTime - cDateTime.getTime())/1000 ;
        diff /= 60 ;
        const minutes = Math.abs(diff)

        console.log("Expired in minutes :- " + minutes);
        
        if(minutes > 2){
            return true;
        }
        return false;

    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports = {
    otpVerification
}