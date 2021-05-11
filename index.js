const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');

const Toolbar = getModule(m=>m.default && m.default.displayName === "MiniPopover", false);
const insertText = e => getModule(['ComponentDispatch'], false).ComponentDispatch.dispatchToLastSubscribed("INSERT_TEXT", {content: e})
const MentionBtn = require("./MentionBtn.jsx")(Toolbar)
module.exports = class QuickMention extends Plugin {
    startPlugin() {
        if(Toolbar) inject("quickmention", Toolbar, "default", ([{children}], ret) => {
            if(!children || !Array.isArray(children) || children.slice(-1).length == 0) return ret;
            const { message } = children.slice(-1)[0].props;
            children.unshift(
                React.createElement(MentionBtn, {
                    onClick: () => insertText("<@" + message.author.id + ">"),
                })
            )
            return ret;
        })
        Toolbar.default.displayName = "MiniPopover"
    }
    pluginWillUnload() {
        uninject("quickmention");
    }
}