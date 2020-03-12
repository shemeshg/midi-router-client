// eslint-disable-next-line
export function arrayMove(arr: any[], oldIndex: number, newIndex: number) {
    while (oldIndex < 0) {
        oldIndex += arr.length;
    }
    while (newIndex < 0) {
        newIndex += arr.length;
    }
    if (newIndex >= arr.length) {
        newIndex = 0 ; 
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
}


export function downloadFileAsString(filename:  string, text: string) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

  // eslint-disable-next-line
  export function readFileAsString(el: HTMLInputElement): Promise<any> {

    return new Promise( (resolve)=>{
        // eslint-disable-next-line
        const files:any = el.files;
        if (files.length === 0) {
            console.log('No file is selected');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            resolve(event.target?.result);
        };
        reader.readAsText(files[0]);

    })

}