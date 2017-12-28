
var iconv = require('iconv-lite');
class RichTextService {



    hex2a(hexx) {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; i <= hex.length; i += 2)
            str +=  String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }


    rtf2text(rtf) {
        let hexStr = this.convertToPlain(rtf);

        let asci = this.hex2a(hexStr);

        return iconv.decode(asci, 'win1251');
    }




    convertToPlain(str) {

        var basicRtfPattern = /\{\*?\\[^{}]+;}|[{}]|\\[A-Za-z]+\n?(?:-?\d+)?[ ]?/g;
        var newLineSlashesPattern = /\\\n/g;
        var ctrlCharPattern = /\n\\f[0-9]\s/g;
        var spacePattern = / /g;
        var nonHexPattern = /[^0-9A-Fa-f]/g;

        //Remove RTF Formatting, replace RTF new lines with real line breaks, and remove whitespace
        return str
            .replace(spacePattern, "20")
            .replace(ctrlCharPattern, "")
            .replace(basicRtfPattern, "")
            .replace(nonHexPattern, "")
            .replace(newLineSlashesPattern, "\n")
            .trim();
    };
};

const RichTextServiceInstance = new RichTextService();

module.exports = RichTextServiceInstance;