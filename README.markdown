Clamps an HTML element's content by adding ellipsis to it if the content inside is too long.

# The difference between the original
Use jquery.  
truncationHTML of IE support.

# Sample Usage

<pre>
// Single line
$("div").clamp({clamp:1});

// Multi line
$("div").clamp({clamp:3, animate:true});

// Use HTML to truncated
$("div").clamp({
  clamp:2,
  truncationChar:'',
  truncationHTML:'&lt;a href=&quot;#&quot;&gt;..Read More&lt;/a&gt;',
  alwaysDisplay:true
});
</pre>
