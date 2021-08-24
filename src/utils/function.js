//替换占位符
export function replacePlaceholder (input, dic) {
    if(!dic) return input;
    for (var key in dic) {
        var reg = new RegExp("\\{"+key+"\\}","g");
        input = input.replace(reg, dic[key]);
    }
    console.log('input',input);
    return input;  
};