import SearchBackdropDesktopSVG from '@svg/page/search_desktop.svg';
import SearchBackdropMobileSVG from '@svg/page/search_mobile.svg';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { CmsApi } from 'services/cms';
import { IPost } from 'types/cms';
import { ArticleCard } from '../components/cards/ArticleCard';
import { ArticleCardRow } from '../components/cards/ArticleCardRow';
import { Contained } from '../components/Contained';
import { HorizontalScrollable } from '../components/HorizontalScrollable';
import { SectionTitle } from '../components/SectionTitle';
import { SuggestDish } from '../components/SuggestDish';
import { Title } from '../components/Title';
import { CMS, METADATA, SEARCH } from '../constants';
import { ScreenContext } from '../contexts/screen';

interface Props {
  posts: IPost[];
  totalCount: number;
  currentPage: number;
}

function Search(props: Props) {
  // Show these options if the user is on this page without entering a query
  const recommendedOptions = <></>;

  const { isDesktop } = useContext(ScreenContext);

  const router = useRouter();
  const [isLoading, setLoading] = useState(false); //State for loading indicator
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  const [topPosts, setTopPosts] = useState([] as IPost[]);

  useEffect(() => {
    const getPosts = async () => {
      const posts = await getTopPosts(4);
      setTopPosts(posts);
    };

    getPosts();
  }, []);

  // Since requests happens after chaning routes url ?page={n} we need to bind loading events
  // on the router change event.
  useEffect(() => {
    //Setting router event handlers after component is located
    router.events.on('routeChangeStart', startLoading);
    router.events.on('routeChangeComplete', stopLoading);

    return () => {
      router.events.off('routeChangeStart', startLoading);
      router.events.off('routeChangeComplete', stopLoading);
    };
  }, []);

  const paginationHandler = page => {
    const currentPath = router.pathname;

    // Copy current query to avoid its removing
    const currentQuery = { ...router.query };
    currentQuery.page = page.selected + 1;

    router.push({
      pathname: currentPath,
      query: currentQuery,
    });
  };

  //
  //
  //
  //
  // USING QUERY          ?s=
  // OR USING CITY        ?city=
  // OR USING CUISINE`    ?cuisine=
  // OR USING CATEGORY?   ?tags=,,
  // OR USING DISH/       ?dish=
  //
  //
  //
  //

  const pageCount = Math.ceil(props.totalCount / SEARCH.SEARCH_ITEMS_PER_PAGE);
  const showPagination = posts.length > 0 && pageCount > 1;

  console.log('search ➡️ pageCount:', pageCount);
  console.log('search ➡️ props.totalCount:', props.totalCount);

  return (
    <div>
      <title>{METADATA.TITLE_SUFFIX}</title>

      <div className="relative w-full mt-6 mb-12">
        {!isDesktop ? (
          <>
            <SearchBackdropMobileSVG
              style={{
                width: '150%',
                transform: 'translateX(-18%)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Title level={1} className="font-somatic text-primary">
                {posts.length > 0 ? 'Search Results' : 'Nothing Found'}
              </Title>
            </div>
          </>
        ) : (
          <Contained>
            <SearchBackdropDesktopSVG className="w-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Title level={1} className="font-somatic text-primary">
                {posts.length > 0 ? 'Search Results' : 'Nothing Found'}
              </Title>
            </div>
          </Contained>
        )}
      </div>

      <Contained>
        <div className="flex flex-col space-y-8">
          {posts.map(post => (
            <ArticleCardRow key={post.slug} {...post} />
          ))}
        </div>

        {showPagination && (
          <div className="mt-8 mobile:mt-12">
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              activeClassName={'active'}
              containerClassName={'pagination'}
              subContainerClassName={''}
              initialPage={props.currentPage - 1}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={paginationHandler}
            />
          </div>
        )}
      </Contained>

      <div className="mt-12 mb-12">
        <Contained>
          <SectionTitle>Didn't find what you were looking for?</SectionTitle>
        </Contained>

        <div className="mt-10">
          <HorizontalScrollable>
            {topPosts?.map(post => (
              <div
                key={post.id.toLowerCase()}
                style={{ width: !isDesktop ? '13rem' : '14rem' }}
                className="mr-6"
              >
                <ArticleCard {...post} />
              </div>
            ))}
          </HorizontalScrollable>
        </div>
      </div>

      <SuggestDish />
    </div>
  );
}

Search.getInitialProps = async ({ query }): Promise<Props> => {
  const cms = new CmsApi();
  const page = query.page ?? 1;
  const { s: encodedSearchQuery } = query;
  const searchQuery = decodeURI(encodedSearchQuery);

  const { posts = [], total: totalCount = 0 } = await cms.searchPosts(
    searchQuery,
    CMS.BLOG_RESULTS_PER_PAGE,
    page,
  );

  return {
    posts,
    totalCount,
    currentPage: page,
  };
};

export default Search;
