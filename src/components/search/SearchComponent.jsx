import "./search.css";
import { TbSearch } from "react-icons/tb";

export function SearchComponent({
	onEnter,
	onSearch,
	onChange,
	title = "Search...",
}) {
	return (
		<div>
			<div className="search-container">
				<input
					type="search"
					id="search"
					onKeyDown={onEnter}
					placeholder={title}
					onInput={onChange}
				/>
				<TbSearch
					onClick={onSearch}
					color="#828488"
					cursor={"pointer"}
					size={18}
				/>
			</div>
		</div>
	);
}
