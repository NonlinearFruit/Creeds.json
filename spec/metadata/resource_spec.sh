Describe 'Resource'
  Parameters:dynamic
      %data "metadata/resources.json" "spec/metadata/Resources.schema.json"
  End

  It "$1 matches the schema $2"
    When call jsonschema -i $1 $2 -F "ERROR: {error.path} {error.message}"
    The status should not be failure
  End
End
