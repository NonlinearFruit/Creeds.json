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
jq '.Data[] | " - [\(.Title)](\(.Url)) » \(.Description)"' $resources --raw-output >> $readme

# WEBSITES
cat >> $readme << 'END'
## Websites
END
jq '.Websites[] | " - [\(.Title)](\(.Url)) » \(.Description)"' $resources --raw-output >> $readme

# IOS
cat >> $readme << 'END'
## iOS
END
jq '.iOS[] | " - [\(.Title)](\(.Url)) » \(.Description)"' $resources --raw-output >> $readme
