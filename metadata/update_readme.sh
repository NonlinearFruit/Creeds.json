readme="README.md"
resources="metadata/resources.json"

# BEGINNING
cat > $readme << 'END'
<p align="center">
  <img src="./metadata/feature_graphic.png">
END
image="https://img.shields.io/badge/documents-$(ls creeds/ -Aq | wc -l)-blue"
link="https://github.com/NonlinearFruit/Creeds.json/tree/master/creeds"
echo  "  <a href=\"$link\"><img src=\"$image\"></a>" >> $readme
image="https://img.shields.io/github/actions/workflow/status/NonlinearFruit/Creeds.json/DataValidation.yml?label=tests&branch=master"
link="https://github.com/NonlinearFruit/Creeds.json/actions/workflows/DataValidation.yml"
echo  "  <a href=\"$link\"><img src=\"$image\"></a>" >> $readme
image="https://img.shields.io/badge/test%20count-$(npm run test-json -s | jq '.numTotalTests - .numTodoTests')-yellowgreen"
link="https://github.com/NonlinearFruit/Creeds.json/tree/master/tests"
echo  "  <a href=\"$link\"><img src=\"$image\"></a>" >> $readme
cat >> $readme << 'END'
</p>

This is a collection of historic creeds of the Christian faith. This repo focuses on the Reformed church.
END

# COPYRIGHTS
cat >> $readme << 'END'
## Copyrights

This repo as a whole is not licensed for reuse due to the copyright right status of several texts (listed below). To reuse these texts, explicit permission needs to be granted by the copyright holder. These documents aside, the rest of this repo is licensed under the [Unlicense](https://choosealicense.com/licenses/unlicense/).

END
for file in creeds/*; do
  jq --arg FILE "$file" '.Metadata | select(.SourceAttribution | startswith("Public Domain") | not) | " - [\(.Title)](\($FILE)) <\(.SourceAttribution)>"' "$file" --raw-output >> $readme
done

# CREEDS
cat >> $readme << 'END'
## Creeds Included

Read more about the json structure [here](https://github.com/NonlinearFruit/Creeds.json/wiki/Json-Structure)

END
for file in creeds/*; do
  jq --arg FILE "$file" '.Metadata | " - [x] [\(.Title) (\(.Year))](\($FILE))"' "$file" --raw-output >> $readme
done

# EXTRAS
cat >> $readme << 'END'
# Additional Resources (aka Bonus Content!)
END

# ANDROID
cat >> $readme << 'END'
## Android Apps
END
jq '.Android[] | " - [\(.Title)](\(.Url)) » \(.Description)"' $resources --raw-output >> $readme

# BOOKS
cat >> $readme << 'END'
## Books
END
jq '.Books[] | " - [\(.Title) by \(.Author) (\(.PublishYear))](\(.Url)) » \(.Description)"' $resources --raw-output >> $readme

# DATA
cat >> $readme << 'END'
## Data
END
jq '.Data[] | " - [\(.Title)](\(.Url)) » \(.Description) ![GitHub last commit](https://img.shields.io/github/last-commit/\(.UserRepo).svg) ![GitHub Repo stars](https://img.shields.io/github/stars/\(.UserRepo).svg)"' $resources --raw-output >> $readme

# WEBSITES
cat >> $readme << 'END'
## Websites
END
jq '.Websites[] | " - [\(.Title)](\(.Url)) » \(.Description)"' $resources --raw-output >> $readme

# IOS
cat >> $readme << 'END'
## iOS Apps
END
jq '.iOS[] | " - [\(.Title)](\(.Url)) » \(.Description)"' $resources --raw-output >> $readme
