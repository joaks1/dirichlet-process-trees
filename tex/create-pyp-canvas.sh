#!/bin/bash

npx="1600"

for tex_path in pyp-?-example.tex
do
    file_prefix="${tex_path/\.tex/}"
    pdf_path="${file_prefix}.pdf"
    png_path="../images/${file_prefix}-blank.png"

    # compile PDFs
    latexmk -C "$tex_path"
    latexmk -pdf "$tex_path"

    convert -density 900 "$pdf_path" -flatten -strip -resize $npx "$png_path"
done
