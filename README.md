<p align="center">
  <img src="./metadata/feature_graphic.png">
</p>

This is a collection of historic creeds of the Christian faith. This repo focuses on the Reformed church.

## Creeds Included
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
- [x] [ ()]()
## Json Structure

Every json file includes a `Metadata` and `Data` attribute on the root object. The metadata structure is identical across every file. The data varies depending on the `CreedFormat` but there are some conventions.

### Json Conventions

- The bulk text of a creed should be in `Content` attributes

### Metadata Structure

```
{
  "Metadata": {
    "Title": "",
    "AlternativeTitles": [""],
    "Year": "",
    "Authors": [""],
    "Location": "",
    "OriginalLanguage": "",
    "OriginStory": "",
    "SourceUrl": "",
    "SourceAttribution": "",
    "CreedFormat": ""
  }
}
```

### Creed Formats

There are several 'formats' to these creeds. Here are the big 4 and what they are called.

#### Creed

This format is named such due to most of the earliest creeds falling into this category.

```
{
  "Data": {
    "Content": "..."
  }
}
```

#### Canon

This format needed a name and so it has one. Though maybe 'Consensus' would be more fitting.

```
{
  "Data": [
    {
      "Article": "",
      "Title": "",
      "Content": "..."
    }
  ]
}
```

#### Confession

This format is named after the Westminster Confession, which has chapters with sections.

```
{
  "Data": [
    {
      "Chapter": "",
      "Title": "",
      "Sections": [
        {
          "Section": "",
          "Content": "..."
        }
      ]
    }
  ]
}
```

#### Catechism

The only format with an intuitive name.

```
{
  "Data": [
    {
      "Number": "",
      "Question": "...",
      "Answer": "..."
    }
  ]
}
```

### Proof Texts

Any object with a `Content` attribute could optionally have proof texts for that content.

```
{
  "Content": "...",
  "ContentWithProofs": "...",
  "Proofs": [
    {
      "Id": "",
      "References": ""
    }
  ],
  "ProofsWithScripture`": [
    {
      "Id": "",
      "References": ""
    }
  ]
}
```

## Handy Dandy Scripts

Add metadata to existing json:

```
jq '{ "Metadata": { "Title": "", "AlternativeTitles": [""], "Year": "", "Authors": [""], "Location": "", "OriginalLanguage": "", "OriginStory": "", "SourceUrl": "", "SourceAttribution": "", "CreedFormat": "" }, "Data": . }' ten_theses_of_berne.json
```
