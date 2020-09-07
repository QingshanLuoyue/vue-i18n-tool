## import: 指定
node.arguments[0] :>>  Node {
  type: 'ImportSpecifier',
  start: 357,
  end: 361,
  loc: SourceLocation {
    start: Position { line: 6, column: 9 },
    end: Position { line: 6, column: 13 }
  },
  imported: Node {
    type: 'Identifier',
    start: 357,
    end: 361,
    loc: SourceLocation {
      start: [Position],
      end: [Position],
      identifierName: 'i18n'
    },
    name: 'i18n',
    leadingComments: undefined,
    innerComments: undefined,
    trailingComments: undefined
  },
  local: Node {
    type: 'Identifier',
    start: 357,
    end: 361,
    loc: SourceLocation {
      start: [Position],
      end: [Position],
      identifierName: 'i18n'
    },
    name: 'i18n',
    leadingComments: undefined,
    innerComments: undefined,
    trailingComments: undefined
  },
  leadingComments: undefined,
  innerComments: undefined,
  trailingComments: undefined
}

## import：赋值
node.arguments[0] :>>  Node {
  type: 'ImportDeclaration',
  start: 348,
  end: 384,
  loc: SourceLocation {
    start: Position { line: 6, column: 0 },
    end: Position { line: 6, column: 36 }
  },
  specifiers: [
    Node {
      type: 'ImportSpecifier',
      start: 357,
      end: 361,
      loc: [SourceLocation],
      imported: [Node],
      local: [Node],
      leadingComments: undefined,
      innerComments: undefined,
      trailingComments: undefined
    }
  ],
  source: Node {
    type: 'StringLiteral',
    start: 369,
    end: 384,
    loc: SourceLocation { start: [Position], end: [Position] },
    extra: { rawValue: './mixins/i18n', raw: "'./mixins/i18n'" },
    value: './mixins/i18n',
    leadingComments: undefined,
    innerComments: undefined,
    trailingComments: undefined
  },
  leadingComments: undefined,
  innerComments: undefined,
  trailingComments: undefined
}


## 普通对象定义
i18n: i18n
type: ''
key: '',
value: ''
node.arguments[0] :>>  Node {
  type: 'ObjectProperty',
  start: 593,
  end: 603,
  loc: SourceLocation {
    start: Position { line: 14, column: 4 },
    end: Position { line: 14, column: 14 }
  },
  method: false,
  key: Node {
    type: 'Identifier',
    start: 593,
    end: 597,
    loc: SourceLocation {
      start: [Position],
      end: [Position],
      identifierName: 'i18n'
    },
    name: 'i18n',
    leadingComments: undefined,
    innerComments: undefined,
    trailingComments: undefined
  },
  computed: false,
  shorthand: false,
  value: Node {
    type: 'Identifier',
    start: 599,
    end: 603,
    loc: SourceLocation {
      start: [Position],
      end: [Position],
      identifierName: 'i18n'
    },
    name: 'i18n',
    leadingComments: undefined,
    innerComments: undefined,
    trailingComments: undefined
  },
  leadingComments: undefined,
  innerComments: undefined,
  trailingComments: undefined
}

## 普通对象定义
i18n: {
    en: {
        x: 1
    },
    cn: {
        x: 2
    }
}
node.arguments[0] :>>  Node {
  type: 'ObjectProperty',
  start: 613,
  end: 716,
  loc: SourceLocation {
    start: Position { line: 15, column: 4 },
    end: Position { line: 22, column: 5 }
  },
  method: false,
  key: Node {
    type: 'Identifier',
    start: 613,
    end: 617,
    loc: SourceLocation {
      start: [Position],
      end: [Position],
      identifierName: 'i18n'
    },
    name: 'i18n',
    leadingComments: undefined,
    innerComments: undefined,
    trailingComments: undefined
  },
  computed: false,
  shorthand: false,
  value: Node {
    type: 'ObjectExpression',
    start: 619,
    end: 716,
    loc: SourceLocation { start: [Position], end: [Position] },
    properties: [ [Node], [Node] ],
    leadingComments: undefined,
    innerComments: undefined,
    trailingComments: undefined
  },
  leadingComments: [
    {
      type: 'CommentLine',
      value: ' i18n: i18n,',
      start: 593,
      end: 607,
      loc: [SourceLocation]
    }
  ],
  innerComments: undefined,
  trailingComments: undefined
}