import { AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server'

export class AuthDirective extends SchemaDirectiveVisitor {
  // the parent and grandparent types.
  visitFieldDefinition(fieldArg, _details) {
    const { resolve } = fieldArg
    const field = fieldArg
    // const requires = this.args.requires
    field.resolve = async (...argsMain) => {
      // Get the required Role from the field first, falling back
      // to the objectType if no Role is required by the field:
      const [parent, args, context, info] = argsMain
      const { user } = context
      if (!user) {
        throw new AuthenticationError('not authorized')
      }
      return resolve.apply(this, argsMain)
    }
  }
}

export class EnsureuserIsBoardMemberDirective extends SchemaDirectiveVisitor {
  // the parent and grandparent types.
  visitFieldDefinition(fieldArgs, _details) {
    const field = fieldArgs
    const { resolve } = fieldArgs
    // const requires = this.args.requires
    field.resolve = async (...argsMain) => {
      // Get the required Role from the field first, falling back
      // to the objectType if no Role is required by the field:
      const [parent, args, context, info] = argsMain
      const { user } = context
      if (!user) {
        throw new AuthenticationError('not authorized')
      }
      return resolve.apply(this, argsMain)
    }
  }
}
