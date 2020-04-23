#!/bin/sh

JS='\.js$'
JSGZ='\.js.gz$'
JSBR='\.js.br'
CSS='\.css$'
CSSGZ='\.css.gz$'
CSSBR='\.css.br$'

[[ $1 = "du" ]] && du -h src/js vendor && echo ''

printsize() {
  ls -la dist/ | grep $1 | awk "{sum+=\$5};END{print \"$2\" sum / 1024 \"K\"}"
}

printsize $JS '[JS] RAW: '
printsize $JSGZ '[JS] GZIP: '
printsize $JSBR '[JS] BROTLI: '
echo ''
printsize $CSS '[CSS] RAW: '
printsize $CSSGZ '[CSS] GZIP: '
printsize $CSSBR '[CSS] BROTLI: '

echo ''
printsize "$CSS\|$JS" '[TOTAL] RAW (no schema included): '
printsize "$CSSGZ\|$JSGZ" '[TOTAL] GZIP (no schema included): '
printsize "$CSSBR\|$JSBR" '[TOTAL] BROTLI (no schema included): '
