let currentLanguage;

function getLanguages(pack="tdesktop") {
	MTProto.invokeMethod("langpack.getLanguages", {lang_pack: pack}).then(l => {
        console.log(l)
    })
}

function setLanguage(code, pack="tdesktop") {
	//TODO Ніхуя не парситься
}