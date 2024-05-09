const isContentUnchanged = (source, newTitle, newContent) =>
    source.title === newTitle && source.content === newContent;

export default isContentUnchanged;