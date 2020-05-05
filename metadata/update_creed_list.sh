vim -s metadata/clear_creeds.vim README.md
for file in $(ls --reverse creeds/); do 
  jq '.Metadata | " - [x] [\(.Title) (\(.Year))](\(.SourceUrl))"' "creeds/${file}" --raw-output | xargs -0 -i sed -i "8i {}" README.md; 
done
