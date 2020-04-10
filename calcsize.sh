#!/bin/sh

JS='\.js$'
JSGZ='\.js.gz$'
CSS='\.css$'
CSSGZ='\.css.gz$'

[[ $1 = "du" ]] && du -h src/js vendor && echo ''

printsize() {
  ls -la dist/ | grep $1 | awk "{sum+=\$5};END{print \"$2\" sum / 1024 \"K\"}"
}

printsize $JS '[JS] RAW: '
printsize $JSGZ '[JS] GZIP: '
echo ''
printsize $CSS '[CSS] RAW: '
printsize $CSSGZ '[CSS] GZIP: '

echo ''
printsize "$CSS\|$JS" '[TOTAL] RAW: '
printsize "$CSSGZ\|$JSGZ" '[TOTAL] GZIP: '
