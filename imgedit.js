// image edit function by OpenCVjs


SHOW_IMG_SIZE = 256


window.addEventListener('load', () => {

    let buttonElement = document.querySelector("#edit");
    let oriImage = document.querySelector("#oriImage");
    let hiddenCanvas = document.querySelector("#hiddenImage");

    let editImage = document.querySelector("#editImage");
    let colorHSlider =document.querySelector("#colorHSlider");
    let colorSSlider =document.querySelector("#colorSSlider");
    let colorVSlider =document.querySelector("#colorVSlider");
    let rotSlider =document.querySelector("#rotSlider");
    let scaleSlider =document.querySelector("#scaleSlider");

    // Copy hidden canvas when new image is loaded.
    // This is for accurate comparison between original and editted image.
    // <img> element and <canvas> element cause slightly different results.
    oriImage.onload = () =>{
        let src1 = cv.imread(oriImage);
        cv.imshow(hiddenCanvas, src1);
        src1.delete();    
    }

    buttonElement.addEventListener("click", () => {
        let src1 = cv.imread(oriImage);
        let dst = new cv.Mat();        
        let dsize = new cv.Size(SHOW_IMG_SIZE, SHOW_IMG_SIZE);
        cv.resize(src1, src1, dsize);

        // color transform
        const hue = colorHSlider.value * 1.0;
        const saturation = colorSSlider.value * 1.0;
        const value = colorVSlider.value * 1.0;
        if ((hue !=0) || (saturation != 0) || (value  != 0)){
            shiftColor(src1, hue, saturation, value);
        }

        // geometric transform
        const rotValue = rotSlider.value;
        const scaleValue = scaleSlider.value;
        if ((rotValue != 0) || (scaleValue != 1)){
            // affine transformation
            let center = new cv.Point(src1.cols / 2, src1.rows / 2);
            let M = cv.getRotationMatrix2D(center, rotValue*1.0, scaleValue*1.0);
            cv.warpAffine(src1, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
        } else{
            dst = src1.clone();
        }

        cv.imshow(editImage, dst);

        src1.delete();
        dst.delete();

    }, false);

});

// color transform function
function shiftColor(src1, hue, saturation, value){
    // convert Color space to HSV
    let tmpMat = new cv.Mat();
    cv.cvtColor(src1, tmpMat, cv.COLOR_RGB2HSV);
    let hsvPlanes = new cv.MatVector();
    cv.split(tmpMat, hsvPlanes);

    // shift Hue value in 0 : 180
    if (hue > 0){
        let H = hsvPlanes.get(0);
        let fH = new cv.Mat();
        H.convertTo(fH, cv.CV_32F);
        let diff = new cv.Mat(H.rows, H.cols, fH.type(), new cv.Scalar(hue));
        cv.add(fH, diff, fH, new cv.Mat(), -1);
        let mod = new cv.Mat(H.rows, H.cols, fH.type(), new cv.Scalar(180.0));
        let mask = new cv.Mat();
        cv.threshold(fH, mask, 180, 1, cv.THRESH_BINARY);
        mask.convertTo(mask, cv.CV_8U);
        cv.subtract(fH, mod, fH, mask, -1);
        fH.convertTo(H, cv.CV_8U);
        diff.delete();
        fH.delete();
        mod.delete();
   
        hsvPlanes.set(0, H);
    }

    // shift Saturation
    if (saturation != 0){
        let S = hsvPlanes.get(1);
        let fS = new cv.Mat();
        S.convertTo(fS, cv.CV_32F);
        let diff = new cv.Mat(S.rows, S.cols, fS.type(), new cv.Scalar(saturation));
        cv.add(fS, diff, fS, new cv.Mat(), -1);
        fS.convertTo(S, cv.CV_8U);
        diff.delete();
        fS.delete();
   
        hsvPlanes.set(1, S);
    }

    // shift Bightness
    if (value != 0){
        let V = hsvPlanes.get(2);
        let fV = new cv.Mat();
        V.convertTo(fV, cv.CV_32F);
        let diff = new cv.Mat(V.rows, V.cols, fV.type(), new cv.Scalar(value));
        cv.add(fV, diff, fV, new cv.Mat(), -1);
        fV.convertTo(V, cv.CV_8U);
        diff.delete();
        fV.delete();
   
        hsvPlanes.set(2, V);
    }



    cv.merge(hsvPlanes, tmpMat);
    cv.cvtColor(tmpMat, src1, cv.COLOR_HSV2RGB);
    cv.cvtColor(src1, src1, cv.COLOR_RGB2RGBA);

    tmpMat.delete();
    hsvPlanes.delete();
}
