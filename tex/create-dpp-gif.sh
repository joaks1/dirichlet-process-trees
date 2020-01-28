#!/bin/bash

npx="1024"
npixels=$(expr $npx \* $npx)


for file_prefix in "dpp-3" "pyp-3"; do
tex_file="${file_prefix}-slides.tex"
pdf_file="${file_prefix}-slides.pdf"
final_pdf="${file_prefix}-gif-slides.pdf"
gif_file="../images/${file_prefix}-example.gif"
mp4_file="${gif_file/\.gif/\.mp4}"
ogg_file="${gif_file/\.gif/\.ogg}"

# compile slides
if [ ! -e "$pdf_file" ]
then
    latexmk -pdf "$tex_file"
else
    echo file "$pdf_file" already exists... Skipping tex compile!
fi

# remove initial slides (necessary because 'againframe' causes position shift)
if [ ! -e "$final_pdf" ]
then
    pdftk "$pdf_file" cat 17-end output "$final_pdf" 
else
    echo file "$final_pdf" already exists... Skipping pdftk!
fi

# convert slides into PNGs and create gif
if [ ! -e "$gif_file" ]
then
    # convert -density 600 "$final_pdf" -flatten -strip -resize @${npixels} -transparent white "PNG8:dpp-3-slide-%02d.png"
    convert -density 600 "$final_pdf" -strip -resize @${npixels} PNG8:dpp-3-slide-%02d.png

    # Create gif from png files
    convert -layers OptimizePlus -delay 75 dpp-3-slide-0?.png dpp-3-slide-1[01234].png -delay 300 dpp-3-slide-1[567].png -loop 0 "$gif_file"

    rm dpp-3-slide-??.png
else
    echo file "$gif_file" already exists... Skipping conversion!
fi

# convert gif into mp4 and ogg
if [ -e "$gif_file" ]
then
    if [ ! -e "$mp4_file" ]
    then
        ffmpeg -f gif -i "$gif_file" "$mp4_file" 
    else
        echo file "$mp4_file" already exists... Skipping conversion! 
    fi
    if [ ! -e "$ogg_file" ]
    then
        ffmpeg -f gif -i "$gif_file" "$ogg_file" 
    else
        echo file "$ogg_file" already exists... Skipping conversion! 
    fi
else
    echo file "$gif_file" does not exist... Skipping video conversions!
fi

done
