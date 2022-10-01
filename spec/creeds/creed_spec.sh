Describe 'Creed'
  Parameters:dynamic
    for file in creeds/*;
    do
      %data $file
    done
  End

  is_ascii() { (file --exclude json $1 2> /dev/null || file json $1) | grep -q "ASCII"; }
  all_proofs_have_footnote() { jq '[.. | objects | select(.Proofs != null) | . as $question | [keys[] | select(endswith("WithProofs")) | . as $key | $question[$key]] | join("") | contains("[\($question.Proofs[].Id)]")] | all' $1; }
  all_footnotes_have_proofs() { jq '[.. | objects | . as $content | [(keys[] | select(endswith("WithProofs"))) as $key | $content[$key]] | select(.!=[]) | join("") | capture("\\[(?<id>[0-9]+)\\]";"g") | .id as $id | [$content.Proofs[].Id | tostring] | contains([$id])] | all' $1; }
  all_nonproof_strings_have_no_footnotes() { jq '[.. | objects | . as $content | keys[] | select(endswith("WithProofs") | not) | $content[.] | type as $contentType | select($contentType == "string") | capture("\\[(?<id>[0-9]+)\\]";"g")] | length == 0' $1; }

  It "$1 is ascii only"
    When call is_ascii $1
    The status should not be failure
  End

  It "$1 has a footnote for each proof text"
    When call all_proofs_have_footnote $1
    The output should equal 'true'
  End

  It "$1 has a proof text for each footnote"
    When call all_footnotes_have_proofs $1
    The output should equal 'true'
  End

  It "$1 matches the metadata schema"
    When call jsonschema -i $1 spec/creeds/Metadata.schema.json -F "ERROR: {error.path} {error.message}"
    The status should not be failure
  End
  
  It "$1 has no footnotes in non-'WithProofs' strings"
    When call all_nonproof_strings_have_no_footnotes $1
    The output should equal 'true'
  End
End

Describe 'Creed with Schema'
  Parameters:dynamic
    for file in creeds/*;
    do
      %data $file "spec/creeds/$(jq .Metadata.CreedFormat $file --raw-output).schema.json"
    done
  End

  It "$1 matches the schema $2"
    When call jsonschema -i $1 $2 -F "ERROR: {error.path} {error.message}"
    The status should not be failure
  End
End
