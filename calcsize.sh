#!/bin/sh

JS='\.js$'
JSGZ='\.js.gz$'
JSBR='\.js.br'
CSS='\.css$'
CSSGZ='\.css.gz$'
CSSBR='\.css.br$'

[[ $1 = "du" ]] && du -h src/js vendor && echo ''

printsize() {
  ls -la dist/ | grep $1 | awk "{sum+=\$5};END{print \"$2\" sum / 1024 \"K $3\"}"
}

printsize $JS '[JS] RAW: \t\t'
printsize $JSGZ '[JS] GZIP: \t\t'
printsize $JSBR '[JS] BROTLI: \t\t'
echo ''
printsize $CSS '[CSS] RAW: \t\t'
printsize $CSSGZ '[CSS] GZIP: \t\t'
printsize $CSSBR '[CSS] BROTLI: \t\t'

echo ''
echo 'some resources are downloaded asynchronously, thus the real transferred size is smaller'
echo ''
printsize "$CSS\|$JS" '[TOTAL] RAW: \t\t' '\t +100K schema'
printsize "$CSSGZ\|$JSGZ" '[TOTAL] GZIP: \t\t' '\t +35K schema'
printsize "$CSSBR\|$JSBR" '[TOTAL] BROTLI: \t' '\t +30K schema'
