import yaml
import json
import sys
import re

footnotePattern = re.compile(r'\[\w+\]')

def add_metadata(yml, json):
    json["Metadata"] = dict(
        Title = yml["name"],
        AlternativeTitles = [],
        Year = str(yml["publication_year"]),
        Authors = [],
        Location = None,
        OriginalLanguage = None,
        OriginStory = None,
        SourceUrl = None,
        SourceAttribution = "Copyright - Reformed Standards",
        CreedFormat = "Confession"
    )
    return json

def add_data(yml, json):
    json["Data"] = [create_chapter(y) for y in yml["chapters"]]
    return json

def create_chapter(yml):
    return dict(
        Title = yml["name"],
        Chapter = str(yml["number"]),
        Sections = [create_section(y) for y in yml["articles"]]
    )

def create_section(yml):
    proof_id_converter = create_proof_converter(yml["verses"])
    return dict(
        Section = str(yml["number"]),
        Content = create_content(yml["text"], proof_id_converter),
        ContentWithProofs = create_content_with_proofs(yml["text"], proof_id_converter),
        Proofs = create_proofs(yml["verses"], proof_id_converter)
    )

def create_proof_converter(yml):
    index = 1
    converter = dict()
    for key in sorted(yml):
        converter[key] = index
        index += 1
    return converter

def create_content(string, converter):
    for key in converter:
        string = string.replace("["+key+"]", "")
    return string.strip()

def create_content_with_proofs(string, converter):
    for key in converter:
        string = string.replace("["+key+"]", "["+str(converter[key])+"]")
    return string.strip()

def create_proofs(yml, converter):
    proofs = []
    for key in yml:
        proofs.append(dict( Id = converter[key], References = yml[key]))
    return proofs

def read_yaml_write_json(yml_file, json_file):
    with open(yml_file, 'r') as yaml_in, open(json_file, "w") as json_out:
        yaml_object = yaml.safe_load(yaml_in)
        json_object = {}
        json_object = add_metadata(yaml_object, json_object)
        json_object = add_data(yaml_object, json_object)
        json.dump(json_object, json_out, sort_keys=True)

read_yaml_write_json(sys.argv[1], sys.argv[2])
