node: IP*

copy_corpus: t

define: def/ICE.def

query: (IP* iDoms {1}ADJP)
   AND (IP* iDoms finiteVerb)
   AND (IP* iDoms !B*|R*)
   AND (IP* iDomsMod V*|M*|R* !linkingVerb|*-þykja|*-gerast|*-blifa|*-blífa|*-heita)

append_label{1}: -ZZZ-BARE_ADJP