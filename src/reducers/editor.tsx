import {
  EDITOR_PAGE_LOADED,
  EDITOR_PAGE_UNLOADED,
  ARTICLE_SUBMITTED,
  ASYNC_START,
  ADD_TAG,
  REMOVE_TAG,
  UPDATE_FIELD_EDITOR,
} from "../constants/actionTypes"

export default (
  state: { tagList?: string[]; tagInput?: string } = {},
  action: {
    type?: string
    payload?: {
      article?: {
        slug?: number
        title: string
        description: string
        body: string
        tagList: string[]
      }
      errors?: any
    }
    error?: any
    subtype?: string
    tag?: string
    key?: any
    value?: any
  },
) => {
  switch (action.type) {
    case EDITOR_PAGE_LOADED:
      return {
        ...state,
        articleSlug: action?.payload?.article?.slug || "",
        title: action?.payload?.article?.title || "",
        description: action?.payload?.article?.description || "",
        body: action?.payload?.article?.body || "",
        tagInput: "",
        tagList: action?.payload?.article?.tagList || [],
      }
    case EDITOR_PAGE_UNLOADED:
      return {}
    case ARTICLE_SUBMITTED:
      return {
        ...state,
        inProgress: null,
        errors: action.error ? action.payload?.errors : null,
      }
    case ASYNC_START:
      if (action.subtype === ARTICLE_SUBMITTED) {
        return { ...state, inProgress: true }
      }
      break
    case ADD_TAG:
      return {
        ...state,
        tagList: state.tagList?.concat(state.tagInput ? [state.tagInput] : []),
        tagInput: "",
      }
    case REMOVE_TAG:
      return {
        ...state,
        tagList: state.tagList?.filter((tag) => tag !== action.tag),
      }
    case UPDATE_FIELD_EDITOR:
      return { ...state, [action.key]: action.value }
    default:
      return state
  }

  return state
}
