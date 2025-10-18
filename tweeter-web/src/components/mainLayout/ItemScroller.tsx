import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserHooks";
import {
  PagedItemPresenter,
  PagedItemView,
} from "../../presenter/PagedItemPresenter";

export const PAGE_SIZE = 10;

interface Props<T, P extends PagedItemPresenter<T, any>> {
  featureUrl: string;
  presenterFactory: (view: PagedItemView<T>) => P;
  itemComponentGenerator: (item: T) => JSX.Element;
}

const ItemScroller = <T, P extends PagedItemPresenter<T, any>>(
  props: Props<T, P>
) => {
  const { presenterFactory, itemComponentGenerator } = props;

  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<T[]>([]);

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: PagedItemView<T> = {
    addItems: (newItems: T[]) => {
      setItems((prev) => [...prev, ...newItems]);
    },
    displayErrorMessage,
  };

  const presenterRef = useRef<PagedItemPresenter<T, any> | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = presenterFactory(listener);
  }

  // Update the displayed user when the URL parameter changes
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam !== displayedUser?.alias
    ) {
      presenterRef
        .current!.getUser(authToken, displayedUserAliasParam)
        .then((toUser) => {
          if (toUser) setDisplayedUser(toUser);
        });
    }
  }, [displayedUserAliasParam]);

  // Reinitialize whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const reset = async () => {
    setItems([]);
    presenterRef.current!.reset();
  };

  const loadMoreItems = async () => {
    presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenterRef.current!.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            {itemComponentGenerator(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
