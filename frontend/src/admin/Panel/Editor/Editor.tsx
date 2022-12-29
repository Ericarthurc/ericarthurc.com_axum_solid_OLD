import {
  Component,
  createSignal,
  Index,
  onMount,
  Setter,
  Show,
} from 'solid-js';
import { adminGetPost, adminUpdatePost } from '../../../api/adminAPI';
import { IPost } from '../../../api/siteAPI';

interface IProps {
  postId: String;
  setSelectedPost: Setter<String>;
}

const Editor: Component<IProps> = (props) => {
  const [post, setPost] = createSignal<IPost>({
    id: '',
    title: '',
    date: '',
    series: '',
    categories: [],
    markdown: '',
  });

  onMount(async () => {
    try {
      const response = await adminGetPost(props.postId);

      setPost(await response.json());
    } catch (error) {}
  });

  const restorePost = async () => {
    try {
      const response = await adminGetPost(props.postId);

      setPost(await response.json());
    } catch (error) {}
  };

  const updatePostField =
    (
      fieldName: 'title' | 'date' | 'series' | 'categories' | 'markdown',
      index?: number
    ) =>
    (event: Event) => {
      const inputElement = event.currentTarget as HTMLInputElement;
      setPost((prev) => {
        if (fieldName == 'categories') {
          prev.categories[index as number] = inputElement.value;
          return { ...prev };
        }
        return {
          ...prev,
          [fieldName]: inputElement.value,
        };
      });
    };

  const addCategory = () => {
    setPost((prev) => {
      prev.categories.push('');
      return { ...prev };
    });
  };

  const removeCategory = (index: number) => (event: Event) => {
    setPost((prev) => {
      return {
        ...prev,
        categories: prev.categories.filter((c) => c !== prev.categories[index]),
      };
    });
  };

  return (
    <>
      <button
        style={{ 'margin-bottom': '25px' }}
        onClick={() => props.setSelectedPost('')}
      >
        Go Back
      </button>
      <button onClick={restorePost}>Restore Post</button>
      <h3>Editor</h3>
      <Show when={post()} fallback={<></>}>
        <h4>Post id: {`${props.postId}`}</h4>
        <label for="title">Title:</label>
        <input
          id="title"
          type="text"
          onInput={updatePostField('title')}
          value={post()?.title}
        ></input>

        <label for="date">Date:</label>
        <input
          id="date"
          type="text"
          onInput={updatePostField('date')}
          value={post()?.date}
        ></input>

        <label for="series">Series:</label>
        <input
          type="series"
          onInput={updatePostField('series')}
          value={post()?.series}
        ></input>

        <label for="categories">Categories:</label>
        <Index each={post()?.categories}>
          {(c, i) => (
            <>
              <input
                id="categories"
                type="text"
                onInput={updatePostField('categories', i)}
                value={c()}
              ></input>
              <button onClick={removeCategory(i)}>-</button>
            </>
          )}
        </Index>
        <button onClick={addCategory}>+</button>

        <label for="markdown">Markdown:</label>
        <textarea
          rows="50"
          cols="50"
          id="markdown"
          onInput={updatePostField('markdown')}
          value={post()?.markdown}
        ></textarea>

        <button
          onClick={async () => {
            try {
              const response = await adminUpdatePost(post());

              setPost(await response.json());
            } catch (error) {}
          }}
        >
          Update
        </button>
      </Show>
    </>
  );
};

export default Editor;