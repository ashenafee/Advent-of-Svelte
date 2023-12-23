<script lang="ts">
	import { onMount } from 'svelte';
    import { nameData, addToNameData } from '$lib/stores/nameData';
    

    const API_URL: string = 'https://advent.sveltesociety.dev/data/2023/day-one.json';

    let rowsPerPage: number = 5;
    let currentPage: number = 1;

    let inputName: string;
    let inputTally: number;

    let paginatedData: {
        name: string;
        tally: number;
    }[] = [];

    /**
     * Loads data from an API, sorts the data based on the 'name' property,
     * updates the store with the sorted data, and paginates the data.
     */
    onMount(async () => {
        // Load the data from API
        const data = await fetch(API_URL);
        const json = await data.json();

        // Sort the data
        json.sort((a: { name: number; }, b: { name: number; }) => {
            if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        });

        // Update the store
        $nameData = json;

        // Paginate the data
        paginateData();
    });

    /**
     * Function to paginate the data.
     * Calculates the start and end index based on the current page and rows per page.
     * Updates the paginatedData array with the sliced portion of the nameData array.
     */
    function paginateData() {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        paginatedData = $nameData.slice(startIndex, endIndex);
    }

    /**
     * Function to navigate to a specific page.
     * 
     * @param {number} pageNumber - The page number to navigate to.
     */
    function goToPage(pageNumber: number) {
        currentPage = pageNumber;
        paginateData();
    }

    /**
     * Updates the number of rows per page and triggers pagination.
     * @param {Event} event - The event object.
     */
    function updateRowsPerPage(event: Event) {
        rowsPerPage = parseInt((event.target as HTMLSelectElement)?.value);
        paginateData();
    }
</script>


<div class="flex flex-col space-y-3 m-3">
    <!-- Record Lookup -->
    <div class="flex flex-row space-x-3">
        <input type="text" placeholder="Name" class="input input-primary" bind:value={inputName} />
        <input type="number" placeholder="Tally" class="input input-primary" bind:value={inputTally} />
        <button class="btn variant-filled-primary" on:click={() => {
            // Check if both fields are filled
            if (inputName && inputTally) {
                // Add the record to the store
                addToNameData(inputName, inputTally);
                // Clear the input fields
                inputName = '';
                inputTally = 0;
                // Paginate the data
                paginateData();
            }
        }}>
            Add
        </button>
    </div>


    <!-- Native Table Element -->
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Name</th>
                <th>Tally</th>
                <th>Verdict</th>
			</tr>
		</thead>
		<tbody>
			{#each paginatedData as row}
				<tr>
					<td>{row.name}</td>
                    <td>{row.tally}</td>
                    <td>{row.tally < 0 ? 'Naughty' : 'Nice'}</td>
				</tr>
			{/each}
		</tbody>
	</table>

    <div class="flex flex-row w-full">
        <div class="flex-grow">
            <button on:click={() => goToPage(currentPage - 1)} disabled={currentPage === 1} class="btn variant-filled-primary w-full">
                Previous
            </button>
        </div>
        <!-- Rows Per Page Selector -->
        <div class="mx-5">
            <!-- <label for="rowsPerPage">Rows Per Page:</label> -->
            <select id="rowsPerPage" class="select" bind:value={rowsPerPage} on:change={updateRowsPerPage}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
            </select>
            
        </div>
    
        <div class="flex-grow">
            <button on:click={() => goToPage(currentPage + 1)} disabled={currentPage === Math.ceil($nameData.length / rowsPerPage)} class="btn variant-filled-primary w-full">
                Next
            </button>
        </div>
    </div>
</div>


