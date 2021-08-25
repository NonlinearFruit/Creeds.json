Describe 'Metadata'
  Parameters:dynamic
    for file in creeds/*;
    do
      %data $file
    done
  End

  It "$1 has valid metadata"
    When call jsonschema -i $1 spec/creeds/Metadata.schema.json -F "ERROR: {error.path} {error.message}"
    The status should not be failure
  End
End

Describe 'Creed'
  Parameters:dynamic
    for file in creeds/*;
    do
      %data $file "spec/creeds/$(jq .Metadata.CreedFormat $file --raw-output).schema.json"
    done
  End

  It "$1 has a valid data"
    When call jsonschema -i $1 $2 -F "ERROR: {error.path} {error.message}"
    The status should not be failure
  End
End
