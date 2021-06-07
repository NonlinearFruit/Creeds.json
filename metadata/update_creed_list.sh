vim -s metadata/clear_creeds.vim README.md

includesSection=$(grep -n '## Creeds' README.md | cut -d: -f1)
includes=$(( $includesSection + 1 ))
for file in $(ls --reverse creeds/); do
  jq '.Metadata | " - [x] [\(.Title) (\(.Year))](\(.SourceUrl))"' "creeds/${file}" --raw-output | \
    xargs -0 -i sed -i "${includes}i {}" README.md;
done

copyrightSection=$(grep -n '## Copyrights' README.md | cut -d: -f1)
copyrights=$(( $copyrightSection + 4 ))
for file in $(ls --reverse creeds/); do
  jq '.Metadata | select(.SourceAttribution | startswith("Public Domain") | not) | " - [\(.Title)](\(.SourceUrl)) <\(.SourceAttribution)>"' "creeds/${file}" --raw-output | \
    xargs -0 -i sed -i "${copyrights}i {}" README.md;
done
