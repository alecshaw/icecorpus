copy_corpus:t

node: IP*
query: (IP* idoms {1}CP-ADV) AND (CP-ADV idoms {2}C|P) AND (C|P idoms ef*|þegar*|meðan*|uns*|þó*|nema*|siðan*) AND (CP-ADV hassister {3}[1]*P*) AND (CP-ADV iprecedes [1]*P*)

replace_label{1}:PP
replace_label{2}:P
add_leaf_after{2}: (CP-ADV (C 0))
add_internal_node{3, 3}: IP-SUB
