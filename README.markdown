# Refresh REST/Webdav for node

This project will be a module that exposes ANY data source as HTTP.  The goals are as follows:

 - Implement GET/PUT/POST/DELETE as typically done in web apps
 - Implement enough of WebDav to enable mounting read/write in Finder
 - Further implement WebDav for other clients as time allows and need arises.

The main goal is to make a simple resource provider for web-apps and other http clients.  This will work with, but not be tied to [node-persistence][]

## RESTful Web Service HTTP methods

<table border="1">
<tbody><tr>
<th>Resource</th>
<th>GET</th>
<th>PUT</th>
<th>POST</th>
<th>DELETE</th>
</tr>
<tr>
<th>Collection URI, such as <code>http://example.com/resources/</code></th>

<td><b>List</b> the members of the collection, complete with their member URIs for further navigation. For example, list all the cars for sale.</td>
<td>Meaning defined as "replace the entire collection with another collection".</td>
<td><b>Create</b> a new entry in the collection where the ID is assigned automatically by the collection. The ID created is usually included as part of the data returned by this operation.</td>
<td>Meaning defined as "delete the entire collection".</td>
</tr>
<tr>
<th>Element URI, such as <code>http://example.com/resources/7HOU57Y</code></th>

<td><b>Retrieve</b> a representation of the addressed member of the collection expressed in an appropriate MIME type</td>
<td><b>Update</b> the addressed member of the collection or <b>create</b> it with the specified ID.</td>
<td>Treats the addressed member as a collection in its own right and creates a new subordinate of it.</td>
<td><b>Delete</b> the addressed member of the collection.</td>

</tr>
</tbody></table>

## WebDav Notes

WebDav clients aren't good about following the spec, here are some notes.

<http://code.google.com/p/sabredav/wiki/Finder>

[node-persistence]: http://github.com/creationix/node-persistence