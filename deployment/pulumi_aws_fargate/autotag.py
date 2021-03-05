# Source: https://github.com/joeduffy/aws-tags-example
import pulumi
from taggable import is_taggable


# register_auto_tags registers a global stack transformation that merges a set
# of tags with whatever was also explicitly added to the resource definition.
def register_auto_tags(auto_tags):
    pulumi.runtime.register_stack_transformation(lambda args: auto_tag(args, auto_tags))


# auto_tag applies the given tags to the resource properties if applicable.
def auto_tag(args, auto_tags):
    if is_taggable(args.type_):
        args.props["tags"] = {**(args.props["tags"] or {}), **auto_tags}
        return pulumi.ResourceTransformationResult(args.props, args.opts)
