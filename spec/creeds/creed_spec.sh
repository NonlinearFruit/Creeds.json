Describe 'Creed'
  Parameters:dynamic
    for file in creeds/*;
    do
      %data $file
    done
  End

  is_ascii() { file $1 | grep -q "ASCII"; }

  It "$1 is ascii only"
    When call is_ascii $1
    The status should not be failure
  End

  It "$1 matches the metadata schema"
    When call jsonschema -i $1 spec/creeds/Metadata.schema.json -F "ERROR: {error.path} {error.message}"
    The status should not be failure
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
