def main [] {
  ls creeds/*.json
  | get name
  | each {
    {
      file: ($in | path parse)
      content: (open $in)
    }
  }
  | group-by --to-table content.Metadata.CreedFormat
  | each {|it|
    match $it.group {
      'Canon' => { make-canons $it }
      'Catechism' => { make-catechisms $it }
      'HenrysCatechism' => { make-henrys-catechisms $it }
      'Confession' => { make-confessions $it }
      'Creed' => { make-creeds $it }
    }
  }
  | flatten
  | str join (char newline)
  | prepend $"# Summary"
  | save -f "docs/src/SUMMARY.md"
}

def make-creeds [it] {
  $it.items
  | each {|c|
    $"# ($c.content.Metadata.Title)\n(make-metadata-view $c)\n\n($c.content.Data.Content)"
    | save -f $"docs/src/($c.file.stem).md"

    $"- [($in.content.Metadata.Title)]\(./($in.file.stem).md)"
  } 
  | prepend $"# ($it.group)"
}

def make-canons [it] {
  $it.items
  | each {|c|
    let articles = $c.content.Data
    | each {|a|
      $"## ($a.Title)\n\n($a.Content)"
    }
    | str join (char newline)

    $"# ($c.content.Metadata.Title)\n(make-metadata-view $c)\n\n($articles)"
    | save -f $"docs/src/($c.file.stem).md"

    $"- [($in.content.Metadata.Title)]\(./($in.file.stem).md)"
  } 
  | prepend $"# ($it.group)"
}

def make-confessions [it] {
  $it.items
  | each {|c|
    let data = $c.content.Data
    | each {|chapter|
      $chapter.Sections
      | each {|section|
        $"### ($section.Section)\n\n($section.Content)"
      }
      | prepend $"## ($chapter.Chapter) ($chapter.Title)"
      | str join (char newline)
    }
    | str join (char newline)

    $"# ($c.content.Metadata.Title)\n(make-metadata-view $c)\n\n($data)"
    | save -f $"docs/src/($c.file.stem).md"

    $"- [($in.content.Metadata.Title)]\(./($in.file.stem).md)"
  } 
  | prepend $"# ($it.group)"
}

def make-catechisms [it] {
  $it.items
  | each {|c|
    let articles = $c.content.Data
    | each {|a|
      $"## ($a.Number) ($a.Question)\n\n($a.Answer)"
    }
    | str join (char newline)

    $"# ($c.content.Metadata.Title)\n(make-metadata-view $c)\n\n($articles)"
    | save -f $"docs/src/($c.file.stem).md"

    $"- [($in.content.Metadata.Title)]\(./($in.file.stem).md)"
  } 
  | prepend $"# ($it.group)"
}

def make-henrys-catechisms [it] {
  $it.items
  | each {|c|
    let data = $c.content.Data
    | each {|question|
      $question.SubQuestions
      | each {|subquestion|
        $"### ($question.Number).($subquestion.Number) ($subquestion.Question)\n\n($subquestion.Answer)"
      }
      | prepend $"## ($question.Number) ($question.Question)\n\n($question.Answer)"
      | str join (char newline)
    }
    | str join (char newline)

    $"# ($c.content.Metadata.Title)\n(make-metadata-view $c)\n\n($data)"
    | save -f $"docs/src/($c.file.stem).md"

    $"- [($in.content.Metadata.Title)]\(./($in.file.stem).md)"
  }
  | prepend $"# ($it.group)"
}

def make-metadata-view [it] {
  $it.content.Metadata
  | reject Title OriginStory
  | update SourceUrl {|it| $"<($it.SourceUrl)>"}
  | insert JsonUrl $"<https://github.com/NonlinearFruit/Creeds.json/blob/master/($it.file | path join)>"
  | transpose Key Value
  | to md
  | [
    "<details>"
    "<summary>"
    "Click to view Metadata"
    "</summary>"
    ""
    ""
    $in
    "</details>"
  ]
  | str join (char newline)
}
