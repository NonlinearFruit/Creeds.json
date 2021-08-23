Describe 'Metadata tests'
  Parameters:dynamic
    for file in creeds/*;
    do
      %data $file
    done
  End

  It "$1 has a valid schema"
    When call jsonschema -i $1 spec/creeds/metadata.schema.json -F "ERROR: {error.path} {error.message}"
    The status should not be failure
  End
End
