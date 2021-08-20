readme="README.md"
resources="metadata/resources.json"

# BEGINNING
cat > $readme << 'END'
<p align="center">
  <img src="./metadata/feature_graphic.png">
</p>

This is a collection of historic creeds of the Christian faith. This repo focuses on the Reformed church.
END

# COPYRIGHTS
cat >> $readme << 'END'
## Copyrights

This repo is not licensed for reuse due to the copyright right status of several texts (listed here). To reuse these texts, explicit permission needs to be granted by the copyright holder.

END
for file in $(ls creeds/); do
  jq '.Metadata | select(.SourceAttribution | startswith("Public Domain") | not) | " - [\(.Title)](\(.SourceUrl)) <\(.SourceAttribution)>"' "creeds/${file}" --raw-output >> $readme
done

# CREEDS
cat >> $readme << 'END'
## Creeds Included

Read more about the json structure [here](https://github.com/NonlinearFruit/Creeds.json/wiki/Json-Structure)

END
for file in $(ls creeds/); do
  jq '.Metadata | " - [x] [\(.Title) (\(.Year))](\(.SourceUrl))"' "creeds/${file}" --raw-output >> $readme
done

# EXTRAS
cat >> $readme << 'END'
# Additional Resources (aka Bonus Content!)
END

# ANDROID
cat >> $readme << 'END'
## Android Apps
END
jq '.Android[] | " - [\(.Title)](\(.Url)) » \(.Description) ![Installs](https://img.shields.io/endpoint?color=green&logo=google-play&logoColor=green&url=https%3A%2F%2Fplayshields.herokuapp.com%2Fplay%3Fi%3D\(.Id)%26l%3Dinstalls%26m%3D%24installs) ![Rating](https://img.shields.io/endpoint?color=blue&logo=google-play&url=https%3A%2F%2Fplayshields.herokuapp.com%2Fplay%3Fi%3D\(.Id)%26l%3Drating%26m%3D%24rating)"' $resources --raw-output >> $readme

# BOOKS
cat >> $readme << 'END'
## Books
END
jq '.Books[] | " - [\(.Title) by \(.Author) (\(.PublishYear))](\(.Url)) » \(.Description)"' $resources --raw-output >> $readme

# DATA
cat >> $readme << 'END'
## Data
END
jq '.Data[] | " - [\(.Title)](\(.Url)) » \(.Description) ![GitHub last commit](https://img.shields.io/github/last-commit/\(.UserRepo)) ![GitHub Repo stars](https://img.shields.io/github/stars/\(.UserRepo))"' $resources --raw-output >> $readme

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
