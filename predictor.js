// prediction functions of tensorflow.js


window.addEventListener('load', () => {

    // disable prediction buttons
    let buttonElement = document.querySelectorAll(".pred-button");
    for (const elem of buttonElement){
        elem.disabled = true;
    }


    // loading model
    let model;
    const loadPreModel = async () => {
        model = await tf.loadLayersModel(MODEL_PATH)
        for (const elem of buttonElement){
            elem.disabled = false;
        }
    }
    loadPreModel();
   
    
    // set orignal and edited viewer configureation
    let baseElement = document.querySelectorAll(".pred");
    for (const elem of baseElement){
        const table = document.createElement("table");
        table.setAttribute("class", "prediction")
        for (const className of MODEL_CLASS_NAMES){
            const tr =document.createElement("tr");
            const td = document.createElement("td");
            td.innerHTML = className;
            tr.appendChild(td);

            const td2 = document.createElement("td");
            td2.innerHTML = 0;
            td2.setAttribute("class", "pred_prob score_value");
            tr.appendChild(td2);

            table.appendChild(tr);
        }
        elem.appendChild(table);
    }

    // predicti original or edited image by DL model
    function predictImage(targetElem, targetKey){
        const probs = tf.tidy(() => {
            const inputWidth = inputHeight = MODEL_IMAGE_SIZE;            
            const tmpCanvas = document.createElement('canvas').getContext('2d');
            tmpCanvas.drawImage(targetElem, 0, 0, inputWidth, inputHeight);
            let imageData = tmpCanvas.getImageData(0, 0, inputWidth, inputHeight);
            // const img = tf.browser.fromPixels(imageData, numChannels).toFloat();            
            const img = tf.browser.fromPixels(imageData, MODEL_NUM_CHANNELS).toFloat();
            const normalized = img.div(255.0);
            const input = normalized.reshape([1, MODEL_IMAGE_SIZE, MODEL_IMAGE_SIZE, MODEL_NUM_CHANNELS]);
            return model.predict(input).dataSync();
        });
        const answer = probs.indexOf(Math.max.apply(null, probs));
        setProbabilty(targetKey, probs, answer);
    }
    
    // for original image
    const predictButton = document.querySelector("#oriPredButton");
    predictButton.addEventListener("click",  (eve)=>{
        // const targetElem = document.querySelector("#oriImage");
        const targetElem = document.querySelector("#hiddenImage");
        predictImage(targetElem, "#oriPred");
    });

    // for edited image
    const editButton = document.querySelector("#editPredButton");
    editButton.addEventListener("click",  (eve)=>{
        const targetElem = document.querySelector("#editImage");
        // const targetElem = document.querySelector("#oriImage");
        predictImage(targetElem, "#editPred");
    });

});


// set prediction results to HTML table
function setProbabilty(elemKey, probs, answer){
    let targets = document.querySelectorAll(elemKey +" table tr .score_value" );
    for(let i = 0; i < probs.length; i++){
        const prob = probs[i];
        const probString = String(Math.ceil(prob * 1000)/10) + "%";
        targets[i].innerHTML = probString;
        if (i == answer){
            targets[i].setAttribute("class", "score_prob score_value");
        } else{
            targets[i].setAttribute("class", "pred_prob score_value");
        }
    }

}