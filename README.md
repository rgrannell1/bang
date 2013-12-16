Bang!
===========

Bang! (a nod to Bing) is a node js application to provide
query redirection to several search engines using DuckDuckGo-like
bang operators. The advantages to using Bang! are it defaults to
Google search, and that it doesn't rely on DuckDuckGo's servers being
operational in order to redirect your query.

It is currently only supported for Firefox on Ubuntu, since that's
my personal setup.

### 1 Installation

The firefox plugin can be installed by running install-search.html. This
will prompt you to add Bang! as your search provider.

The node server can then be executed manually.

```

```

For long-term use it is wise to set the node server to start automatically
after restart using crontab.

```bash








```

### 2 Examples

```
!gh arrow

```