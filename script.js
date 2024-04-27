const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");//it Will select all the input = checkbox present in the code. by querySelectorAll method
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';//symbol string so that we can fetch one symbol randomly

setIndicator("#ccc");
//initialization
let password = "";// starting me password khali pda hai
let passwordLength = 10;//default length is 10 in starting
let checkCount = 0;//starting me 1 checkbox already ticked hai
handleSlider();
//ste strength circle color to grey


//set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;//slider k value set hoga
    lengthDisplay.innerText = passwordLength;//display k text show hoga = pass length
    //or kuch bhi karna chahiye ? - HW
    // hard part---->>>
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"
    //first part for width and second part for height ie 100 %
    //we are calculating this for handleslider appearance ki jha tk scroll krte h vha violet rhta baki bg color rhta hai
}

function setIndicator(color) {//input parameter k colour set kr dega ui me
    indicator.style.backgroundColor = color;// style.backgroundColor se colour set hota hai backgroung ka
    //shadow ka code hw hai
    indicator.style.boxShadow='0px 0px 12px 1px ${color}';
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
    //math.random generates a number between 0 and 1 where 0 is inclusive and 1 is exclusive 
    // isme (max-min) multiply krege to ab ans aayega 0 se (max-min) k beeech me
    // but we need from min to max so we will add min to this 
    //math.floor to roundoff, to get exact number instead of floating no.
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))
       //97-lowercase a ki ascii value and 123 for z 
       //String.fromCharCode will convert ascii value into an character
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
//65-for capital Z
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);//random num between 0 and length of symbol string
    return symbols.charAt(randNum);//randNum index p jo symbol h vo return krna hai
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;// .checked check wether a checkbox is checked or not
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");//colour set kr rhee and rules can be different according to coders
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent() {//writeText is a asynchronous fucn so we will use async keyword for this function
    try {// we are using try catch here bcz there is a chance of error kyuki maybe koi text hi na ho copy krne k liye
        await navigator.clipboard.writeText(passwordDisplay.value);
        //it is a async fucn so we have to wait for the first process to complete so we used await keyword, phla process hai jo display p hai usko clipboard p copy krna
        copyMsg.innerText = "copied";
        //jaisehi promise resolve ho jayefa we will show copied text in span of copyContent
    }
    catch(e) {//if promise failed to failed likha hua aa jayega
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);//2 second k baad active class ko remove kr doge

}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {//loop chl rha h last index se zero tk
        const j = Math.floor(Math.random() * (i + 1));//finding random no. j in range of 0 to i+1 where 0 is inclusive and i+1 exclusive
        //now swap element at i and j
        const temp = array[i];//
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));//now adding these shuffled elements in new str and return it
    return str;
}

function handleCheckBoxChange() {//jb jb change hoga tb tb phir se sara checkbox ko check krke count krega ki kitna ticked hai
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {//agr passlen 1 hai and all 4 cb are checked then 4 length k pass bnega
        passwordLength = checkCount;
        handleSlider();//passlength is changed so have to call handleslider fucn
    }
}

allCheckBox.forEach( (checkbox) => {//foreach is loop to travel each checkbox
    checkbox.addEventListener('change', handleCheckBoxChange);//change means check or uncheck
    //jb jb kisis bhi checkbox m koi change hoga(tick ya untick) tb tb fucn call hoga handlecheckboxchange
})

//yha input vle event p listener lgana hai
inputSlider.addEventListener('input', (e) => {// jb bhi input eventSlider me change ho rha hai
    passwordLength = e.target.value;//es new input ko pass length me copy kr dege
    handleSlider();//es fucn ko call krne se inputSlider and lengthDiplay update ho jayega
})


copyBtn.addEventListener('click', () => {//click vale event p listener lgana hai
    if(passwordDisplay.value)//if passdisplay.value ek valid value hai that is not empty to copyContent fucn call ho jayega
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;//means do nothing

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
   // console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];//empty array to add the checked fucns in it
    //from this array we willl randomly select any fucn and call it

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {// jo jo fucn ko array m dala vo checked hait o unko call krke pass m dal do
        password += funcArr[i]();
    }
   // console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {//remaining fucn randomly ja rhe pass me
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    //console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));//pass ko array k form m bhj diya
   // console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password; //display m pass dikha diya
   // console.log("UI adddition done");
    //calculate strength
    calcStrength();//call strength calc fucn
});