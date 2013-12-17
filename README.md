Bang!
===========

Bang! (a nod to Bing) is a node js application to provide
query redirection to several search engines using DuckDuckGo-like
bang operators. The advantages to using Bang! are it defaults to
Google search, and that it doesn't rely on DuckDuckGo's servers being
operational in order to redirect your query.

It is currently only supported for Firefox on Ubuntu, since that's
my personal setup.

### 0 Requirements

* Firefox (tested on 26)
* Ubuntu (tested on 13.10)
* Node.js v0.10.20
* Node forever

### 1 Installation

First, download the repository from github.

```bash
git clone https://github.com/rgrannell1/bang
cd bang
```

The firefox plugin can be installed by running install-search.html. This
will prompt you to add Bang! as your search provider.

```bash
firefox install-search.html
```

The node server can then be executed manually.

```bash
node lib/bang.js
```

For long-term use it is wise to set the node server to start automatically
after restart using crontab.

Node forever is required to restart the script in the event of a crash,
so install it.

```bash
sudo npm install forever -g
```
Now edit the crontab and add the following line to the end

```bash
crontab -e
@reboot /home/user/absolute_path_to_bang_cronjob.sh
```

Obviously substituting that path for the path to the shell script included in
the bang repository.

