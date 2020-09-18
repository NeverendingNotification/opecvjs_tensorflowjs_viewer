// set GUI components of Image Editors

window.addEventListener('load', () => {
    // set Image Elements
    let imgElement = document.querySelector("#oriImage");
    let inputElement = document.querySelector("#fileInput");
    let resetElement = document.querySelector("#reset");

    inputElement.addEventListener("change", e => {
        imgElement.src = URL.createObjectURL(e.target.files[0]);
        resetEditValue();
    }, false);

    // add editor elements
    const rootControl = document.querySelector("#controlValue");    
    let sliderElement = class SliderElement{
        constructor(keyword, text, min, max, v0, step){
            this.text = text;
            this.min = min;
            this.max = max;
            this.v0 = v0;
            this.step = step;
            this.keyword = keyword;
        }
    };

    // set control object to control root object
    let setDom = (elem) => {
        const key = elem.keyword;
        let parent = document.createElement("div");
        parent.setAttribute("class", "control-unit");
        parent.setAttribute("id", key);
        parent.innerHTML = elem.text;

        let slider = document.createElement("input");
        slider.setAttribute("type", "range");
        slider.setAttribute("class", "control-slider");
        slider.setAttribute("id", key+"Slider");
        slider.setAttribute("value", elem.v0);
        slider.setAttribute("min", elem.min);
        slider.setAttribute("max", elem.max);
        slider.setAttribute("step", elem.step);
        parent.appendChild(slider);

        let text = document.createElement("input");
        text.setAttribute("type", "text");
        text.setAttribute("class", "control-value");
        text.setAttribute("id", key+"Value");
        text.setAttribute("value", elem.v0);
        parent.appendChild(text);

        rootControl.appendChild(parent);
    };


    // Current edit parameters
    const editParams = {
        "#colorH" : new sliderElement("colorH", "色相", 0, 180, 0, 1),        
        "#colorS" : new sliderElement("colorS", "彩度", -255, 55, 0, 1),     
        "#colorV" : new sliderElement("colorV", "明度", -255, 255, 0, 1),   
        "#rot" : new sliderElement("rot", "回転", -90, 90, 0, 1),   
        "#scale" : new sliderElement("scale", "拡大縮小", 0.1, 2.0, 1.0, 0.05),   
    }
    for (let [key, value] of Object.entries(editParams)) {
        setDom(value);
        linkSliderText(key+"Slider", key+"Value");
    }

    
    let resetEditValue = () =>{
        for (let [key, value] of Object.entries(editParams)) {
            let slider = document.querySelector(key + "Slider");
            slider.value = value.v0;
            let text = document.querySelector(key + "Value");
            text.value = value.v0;
        }
    };

    resetElement.addEventListener("click", (eve)=>{
        resetEditValue();
    });

});



function linkSliderText(sliderID, textID){
    const sliderElement = document.querySelector(sliderID);
    const valueElement = document.querySelector(textID);

    sliderElement.addEventListener("change", (eve)=>{
        valueElement.value = sliderElement.value;
    });
    valueElement.addEventListener("change", (eve)=>{
        sliderElement.value = valueElement.value;
    });    
}
