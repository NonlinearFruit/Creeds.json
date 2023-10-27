# Header
let tests = npm run test-json -s | from json
let test_count = $tests.numTotalTests - $tests.numTodoTests
let creed_count = ls creeds | length
let badges_html = [
  {
    image: $"https://img.shields.io/badge/test%20count-($test_count)-yellowgreen"
    link: "https://github.com/NonlinearFruit/Creeds.json/tree/master/tests"
  }
  {
    image: "https://img.shields.io/github/actions/workflow/status/NonlinearFruit/Creeds.json/DataValidation.yml?label=tests&branch=master"
    link: "https://github.com/NonlinearFruit/Creeds.json/actions/workflows/DataValidation.yml"
  }
  {
    image: $"https://img.shields.io/badge/documents-($creed_count)-blue"
    link: "https://github.com/NonlinearFruit/Creeds.json/tree/master/creeds"
  }
]
| each {|badge| $'  <a href="($badge.link)"><img src="($badge.image)"></a>(char newline)'}
| reduce {|it, acc| $it + $acc} 

let header_html = $'
<p align="center">
  <img src="./metadata/feature_graphic.png">
($badges_html)
</p>
'

# Copyrights
let copyrights = ls creeds 
| each {|file| 
  let data = open $file.name
  $file 
  | insert output $" - [($data.Metadata.Title)]\(($file.name)) <($data.Metadata.SourceAttribution)>"
  | insert attribution $data.Metadata.SourceAttribution
} 
| where {|it|  ($it | get attribution | str starts-with "Public Domain") != true} 
| each {|it| $it.output}
| reduce {|it, acc| $acc + (char newline) + $it}

# Creeds
let creeds = ls creeds/ | each {|file| 
  let data = open $file.name | get Metadata
  $" - [x] [($data.Title) \(($data.Year))]\(($file.name))"
}
| reduce {|it, acc| $acc + (char newline) + $it}

# Resources
let resources = open metadata/resources.json

let android = $resources | get Android | each {|item|
  $" - [($item.Title)]\(($item.Url)) » ($item.Description)"
}
| reduce {|it, acc| $acc + (char newline) + $it}

let book = $resources | get Books | each {|item|
  $" - [($item.Title) by ($item.Author) \(($item.PublishYear))]\(($item.Url)) » ($item.Description)"
}
| reduce {|it, acc| $acc + (char newline) + $it}

let data = $resources | get Data | each {|item|
  $" - [($item.Title)]\(($item.Url)) » ($item.Description) ![GitHub last commit]\(https://img.shields.io/github/last-commit/($item.UserRepo).svg) ![GitHub Repo stars]\(https://img.shields.io/github/stars/($item.UserRepo).svg)"
}
| reduce {|it, acc| $acc + (char newline) + $it}

let websites = $resources | get Websites | each {|item|
  $" - [($item.Title)]\(($item.Url)) » ($item.Description)"
}
| reduce {|it, acc| $acc + (char newline) + $it}

let ios = $resources | get iOS | each {|item|
  $" - [($item.Title)]\(($item.Url)) » ($item.Description)"
}
| reduce {|it, acc| $acc + (char newline) + $it}

let readme = $"
($header_html)
This is a collection of historic creeds of the Christian faith. This repo focuses on the Reformed church.
## Copyrights

This repo as a whole is not licensed for reuse due to the copyright right status of several texts \(listed below). To reuse these texts, explicit permission needs to be granted by the copyright holder. These documents aside, the rest of this repo is licensed under the [Unlicense]\(https://choosealicense.com/licenses/unlicense/).

($copyrights)
## Creeds Included

Read more about the json structure [here]\(https://github.com/NonlinearFruit/Creeds.json/wiki/Json-Structure)

($creeds)
# Additional Resources \(aka Bonus Content!)
## Android Apps
($android)
## Books
($book)
## Data
($data)
## Websites
($websites)
## iOS Apps
($ios)
"

$readme | save -f README.md

print $readme
